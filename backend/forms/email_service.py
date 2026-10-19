"""One presentation layer for every NovaNest Holding transactional email.

All backend email flows render the same Django template: default_email.html.
Keep SMTP/Mailgun transport separate from the email's appearance.
"""
from __future__ import annotations

from typing import Iterable, Optional, Sequence, Tuple

from django.template.loader import render_to_string

from .brevo import send_brevo_email

Row = Tuple[str, object]


def render_standard_email(
    *,
    title: str,
    intro: str = '',
    message: str = '',
    rows: Optional[Sequence[Row]] = None,
    note: str = '',
    language: str = 'en',
    preheader: str = '',
) -> tuple[str, str]:
    """Return plain text and HTML using a single branded HTML template.

    Django's default autoescaping protects applicant-supplied strings.
    The plain-text alternative remains readable when HTML is unavailable.
    """
    if language not in ('en', 'fa'):
        language = 'en'
    values = [(str(label), '' if value is None else str(value)) for label, value in (rows or ())]
    context = {
        'language': language,
        'title': title,
        'intro': intro,
        'message': message,
        'rows': values,
        'note': note,
        'preheader': preheader or title,
    }
    html = render_to_string('default_email.html', context)
    segments = [part for part in (title, intro, message) if part]
    if values:
        segments.append('\n'.join(f'{label}: {value}' for label, value in values))
    if note:
        segments.append(note)
    segments.append('NovaNest Holding — Synergy of energy\nwww.novanestholding.com | info@novanestholding.com\n3833 Evergreen Pl, Vancouver, BC V3J 0M2, Canada | +1 (778) 986-5432')
    return '\n\n'.join(segments), html


def send_branded_brevo_email(
    to: str | Iterable[str],
    *,
    subject: str,
    title: str,
    intro: str = '',
    message: str = '',
    rows: Optional[Sequence[Row]] = None,
    note: str = '',
    language: str = 'en',
    preheader: str = '',
    from_email: Optional[str] = None,
) -> bool:
    """Use the existing Brevo SMTP transport with the shared layout."""
    plain, html = render_standard_email(
        title=title, intro=intro, message=message, rows=rows,
        note=note, language=language, preheader=preheader,
    )
    return send_brevo_email(to, subject, plain, html=html, from_email=from_email)
