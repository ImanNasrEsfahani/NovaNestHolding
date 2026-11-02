import json

from django.http import JsonResponse
from django.test import RequestFactory, TestCase

from .middleware import SubmissionAuditMiddleware
from .models import SubmissionAudit


class SubmissionAuditMiddlewareTests(TestCase):
    def setUp(self):
        self.factory = RequestFactory()

    def test_saved_form_includes_context_and_rejects_query_values(self):
        middleware = SubmissionAuditMiddleware(
            lambda request: JsonResponse({'reference': 42, 'notifications_sent': False}, status=202)
        )
        context = {
            'source_path': '/en/investment?token=secret',
            'timezone': 'America/Vancouver',
            'utm_source': 'newsletter',
            'utm_campaign': 'fall',
        }
        request = self.factory.post('/small-reservation', data='{}', content_type='application/json',
                                    HTTP_X_SUBMISSION_CONTEXT=json.dumps(context))
        response = middleware(request)
        self.assertEqual(response.status_code, 202)
        audit = SubmissionAudit.objects.get(form_key='small-reservation', record_id=42)
        self.assertEqual(audit.source_path, '/en/investment')
        self.assertEqual(audit.utm_source, 'newsletter')
        self.assertEqual(audit.timezone, 'America/Vancouver')
        self.assertNotIn('secret', str(audit.__dict__))

    def test_affiliate_specific_route_and_persian_language(self):
        middleware = SubmissionAuditMiddleware(lambda r: JsonResponse({'reference': 3}, status=201))
        request = self.factory.post('/affiliate-applications/sama-owj-middle-east',
                                    HTTP_REFERER='https://www.novanestholding.com/fa/affiliate/sama-owj-middle-east/apply')
        middleware(request)
        audit = SubmissionAudit.objects.get(form_key='affiliate-applications', record_id=3)
        self.assertEqual(audit.language, 'fa')
        self.assertEqual(audit.source_path, '/fa/affiliate/sama-owj-middle-east/apply')

    def test_invalid_or_unsaved_responses_not_recorded(self):
        for code in (200, 400, 429, 500):
            with self.subTest(status_code=code):
                middleware = SubmissionAuditMiddleware(lambda r: JsonResponse({'reference': 9}, status=code))
                middleware(self.factory.post('/investor-registration'))
        self.assertEqual(SubmissionAudit.objects.count(), 0)

    def test_absent_context_does_not_invent_english_language(self):
        middleware = SubmissionAuditMiddleware(lambda r: JsonResponse({'reference': 77}, status=201))
        middleware(self.factory.post('/affiliate-inquiries/sama-owj-middle-east'))
        audit = SubmissionAudit.objects.get(form_key='affiliate-inquiries', record_id=77)
        self.assertEqual(audit.source_path, '')
        self.assertEqual(audit.language, '')

    def test_unrecognized_paths_not_recorded(self):
        middleware = SubmissionAuditMiddleware(lambda r: JsonResponse({'reference': 10}, status=201))
        middleware(self.factory.post('/admin/something'))
        self.assertEqual(SubmissionAudit.objects.count(), 0)

    def test_all_fifteen_form_locations_have_audit_coverage(self):
        cases = [
            ('/contactUs-form', '/en/about-us'),
            ('/small-reservation', '/en/investment'),
            ('/small-reservation', '/en/acceleration'),
            ('/small-reservation', '/en/pnp'),
            ('/investor-registration', '/en/investor-registration'),
            ('/partner-membership', '/en/affiliate-registration-form'),
            ('/startups-form', '/en/startups-validation'),
            ('/join-as-mentor', '/en/join-as-a-mentor'),
            ('/join-as-a-trainee', '/en/join-as-a-trainee'),
            ('/join-our-team', '/en/join-our-team'),
            ('/work-with-us', '/en/join-us'),
            ('/affiliate-inquiries/sama-owj-middle-east', '/en/affiliate/sama-owj-middle-east'),
            ('/affiliate-applications/gohar-afarinan-farda', '/fa/affiliate/gohar-afarinan-farda/apply'),
            ('/contact-profile', '/en/profile/rasoul-moradimehr'),
            ('/small-reservation', '/en/startup'),
        ]
        for index, (endpoint, page) in enumerate(cases, start=100):
            with self.subTest(path=page):
                middleware = SubmissionAuditMiddleware(
                    lambda r, pk=index: JsonResponse({'reference': pk}, status=201))
                request = self.factory.post(endpoint, HTTP_X_SUBMISSION_CONTEXT=json.dumps({'source_path': page}))
                middleware(request)
                form_key = endpoint.strip('/').split('/')[0]
                audit = SubmissionAudit.objects.get(form_key=form_key, record_id=index)
                self.assertEqual(audit.source_path, page)
                self.assertEqual(audit.language, 'fa' if page.startswith('/fa/') else 'en')
        self.assertEqual(SubmissionAudit.objects.count(), 15)
