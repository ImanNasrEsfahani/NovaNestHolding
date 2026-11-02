"""Record optional, non-sensitive marketing context after a form was saved.

The audit operation must never roll back or turn a successfully saved public
submission into an HTTP 500. There is no IP or raw user-agent tracking here.
"""
import json
import logging
import re
from urllib.parse import urlsplit

from .models import SubmissionAudit

logger = logging.getLogger(__name__)

FORM_PATH = re.compile(
    r'^/(?:'
    r'contactUs-form|small-reservation|investor-registration|partner-membership|'
    r'startups-form|join-as-mentor|join-as-a-trainee|join-our-team|'
    r'work-with-us|contact-profile|affiliate-(?:applications|inquiries)/[a-z0-9-]+'
    r')/?$'
)
ALLOWED_CONTEXT = {
    'source_path': 500, 'referrer_host': 250, 'timezone': 100,
    'utm_source': 160, 'utm_medium': 160, 'utm_campaign': 160,
    'utm_content': 160, 'utm_term': 160,
}


def safe_source_path(raw):
    if not isinstance(raw, str):
        return ''
    # Never capture query strings, fragments, tokens, or external URLs.
    path = raw.split('?', 1)[0].split('#', 1)[0]
    return path[:500] if re.fullmatch(r'/(?:en|fa)(?:/[a-zA-Z0-9/_-]*)?', path) else ''


def parse_context(request):
    try:
        header = request.headers.get('X-Submission-Context', '')
        if len(header) > 4096:
            raise ValueError('Context header is too large')
        context = json.loads(header) if header else {}
        if not isinstance(context, dict):
            context = {}
    except (ValueError, TypeError):
        context = {}
    parsed = {}
    for key, limit in ALLOWED_CONTEXT.items():
        value = context.get(key, '')
        parsed[key] = value.strip()[:limit] if isinstance(value, str) else ''
    parsed['source_path'] = safe_source_path(parsed['source_path'])
    if not re.fullmatch(r'[A-Za-z0-9/_+.-]{1,100}', parsed['timezone']):
        parsed['timezone'] = ''
    # The browser may omit the optional client context header.
    try:
        referer = urlsplit(request.headers.get('Referer', ''))
        # HTTP Referer identifies the submitting page, not necessarily the
        # page that led the visitor to it. Keep referrer_host unset unless
        # the browser explicitly provided document.referrer.
        if not parsed['source_path']:
            parsed['source_path'] = safe_source_path(referer.path)
    except ValueError:
        pass
    source = parsed['source_path']
    language = 'fa' if source.startswith('/fa/') else ('en' if source.startswith('/en/') else '')
    return {**parsed, 'language': language}


class SubmissionAuditMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        if request.method != 'POST' or response.status_code not in (201, 202):
            return response
        path = request.path
        if not FORM_PATH.fullmatch(path):
            return response
        try:
            data = getattr(response, 'data', None)
            if data is None and response.get('Content-Type', '').startswith('application/json'):
                data = json.loads(response.content)
            reference = data.get('reference') if isinstance(data, dict) else None
            if type(reference) is not int or reference <= 0:
                return response
            form_key = path.strip('/').split('/')[0]
            context = parse_context(request)
            SubmissionAudit.objects.update_or_create(
                form_key=form_key, record_id=reference,
                defaults=context,
            )
        except Exception:
            logger.exception('Could not persist optional public form audit context for %s', path)
        return response
