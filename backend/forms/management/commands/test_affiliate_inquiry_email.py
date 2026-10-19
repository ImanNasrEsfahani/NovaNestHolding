"""Safely test all three affiliate PROFILE contact emails to one address.

Usage:
  python manage.py test_affiliate_inquiry_email --to your-own@example.com
  python manage.py test_affiliate_inquiry_email --to your-own@example.com --fa

No database writes and never contacts the real affiliate.
"""
from django.core.exceptions import ValidationError
from django.core.management.base import BaseCommand, CommandError
from django.core.validators import validate_email

from forms.affiliate_inquiries import build_inquiry_email
from forms.models import AffiliateInquiry


class Command(BaseCommand):
    help = 'Send all three sample affiliate profile inquiry emails to --to only.'

    def add_arguments(self, parser):
        parser.add_argument('--to', required=True, help='An email mailbox you control.')
        parser.add_argument('--fa', action='store_true', help='Test the Persian applicant receipt.')

    def handle(self, *args, **options):
        recipient = options['to'].strip()
        try:
            validate_email(recipient)
        except ValidationError as exc:
            raise CommandError('Please supply a valid --to email address.') from exc

        inquiry = AffiliateInquiry(
            pk=999999,
            affiliate_slug='test-only',
            affiliate_name='NovaNest Test Affiliate',
            partner_primary_email=recipient,
            first_name='Test',
            last_name='Contact',
            email=recipient,
            phone_number='+17789865432',
            message='This is a test of the affiliate profile contact form.',
            submission_language='fa' if options['fa'] else 'en',
        )
        for role in ('admin', 'partner', 'applicant'):
            message = build_inquiry_email(inquiry, role, [recipient])
            message.subject = '[TEST ONLY] ' + message.subject
            count = message.send(fail_silently=False)
            if count != 1:
                raise CommandError(f'{role}: mail provider did not accept the message.')
            self.stdout.write(self.style.SUCCESS(f'{role}: Graph accepted message (202)'))
