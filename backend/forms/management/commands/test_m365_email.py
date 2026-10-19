"""Explicit, recipient-restricted real-mail test without database writes.

  python manage.py test_m365_email --to you@example.com
  python manage.py test_m365_email --to you@example.com --affiliate-three
"""
from django.core.management.base import BaseCommand, CommandError
from django.core.validators import validate_email
from django.core.exceptions import ValidationError

from forms.email_service import send_branded_email
from forms.affiliate_applications import build_email
from forms.models import AffiliateApplication


class Command(BaseCommand):
    help = 'Send one sample message, or three Affiliate role samples, to only --to.'

    def add_arguments(self, parser):
        parser.add_argument('--to', required=True, help='YOUR controlled mailbox. Never an affiliate.')
        parser.add_argument('--affiliate-three', action='store_true', help='Test admin, partner, applicant variants.')

    def handle(self, *args, **options):
        recipient = options['to'].strip()
        try:
            validate_email(recipient)
        except ValidationError as exc:
            raise CommandError('Invalid --to email address') from exc

        if options['affiliate_three']:
            app = AffiliateApplication(
                pk=999999,
                affiliate_slug='test-only',
                affiliate_name='NovaNest QA (test only)',
                partner_primary_email=recipient,
                full_name='Test Applicant',
                phone_number='+14165550123',
                email=recipient,
                position='owner_ceo', years_of_experience='10_20',
                industry_field='Software', assets_range='under_300k',
                education_degree='bachelor', language_level='advanced',
                traveled_to_canada=False, visa_rejected=False,
                submission_language='fa',
            )
            for role in ('admin', 'partner', 'applicant'):
                msg = build_email(app, role, [recipient], [recipient])
                msg.subject = '[TEST ONLY] ' + msg.subject
                if msg.send(fail_silently=False) != 1:
                    raise CommandError(f'Microsoft 365 did not accept {role} message')
                self.stdout.write(self.style.SUCCESS(f'{role}: Graph accepted the message (202)'))
        else:
            ok = send_branded_email(
                [recipient],
                subject='[TEST ONLY] NovaNest Microsoft 365 email',
                title='Microsoft 365 integration test',
                intro='This is an explicitly requested test, not a submitted form.',
                message='NovaNest Holding uses the shared default_email.html template.',
                note='No database records or affiliate messages were created.',
            )
            if not ok:
                raise CommandError('Microsoft 365 did not accept the email')
            self.stdout.write(self.style.SUCCESS('Microsoft Graph accepted the email (HTTP 202). Check Inbox/Spam.'))
