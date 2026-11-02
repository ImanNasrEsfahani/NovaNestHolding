"""Reliable notifications for public Investor/Jobs/Mentor/Trainee/Profile forms.

Persist before sending. Notifications are independent and retriable by re-calling
notify_registration(instance, kind); previously accepted roles are skipped.
A provider acceptance is not a guarantee that an inbox received the message.
"""
import logging
import os
from datetime import timezone

from django.conf import settings
from django.core.mail import EmailMultiAlternatives
from django.core.validators import validate_email
from django.db.models.fields.files import FieldFile

from .email_service import render_standard_email

log = logging.getLogger(__name__)
NOTIFICATION_FIELD_NAMES = {'id', 'created_at', 'createdAt', 'updatedAt',
    'submission_language', 'applicant_notified', 'admin_notified', 'notification_error'}

LABELS = {
    'firstName': 'First name', 'lastName': 'Last name', 'phoneNumber': 'Phone',
    'countryOfResidence': 'Country of residence', 'cityOfResidence': 'City of residence',
    'provinceOfResidence': 'Province of residence', 'companyName': 'Company',
    'investmentCeiling': 'Maximum investment', 'preferredAreas': 'Preferred investment areas',
    'howDidYouKnowUs': 'How applicant heard about us', 'website': 'Website',
    'linkedin': 'LinkedIn', 'instagram': 'Instagram', 'ExpertiesAreas': 'Expertise areas',
    'typeOfCollaboration': 'Collaboration type', 'fieldOfExpert': 'Field of expertise',
    'fieldOfExpertOther': 'Other expertise', 'tellUsAboutYourself': 'About applicant',
    'educationLevel': 'Education level', 'educationField': 'Education field',
    'workHistorySummary': 'Work history', 'birthDate': 'Birth date', 'cvFile': 'CV file',
    'briefIntroduction': 'Introduction', 'message': 'Message', 'subject': 'Subject',
    'profileSlug': 'Contacted profile slug',
    'your_position': 'Position', 'type_of_contract': 'Contract type',
    'uni': 'University', 'your_first_name': 'First name',
    'your_last_name': 'Last name', 'phone_number': 'Phone',
    'your_field_of_study': 'Field of study', 'your_subfield': 'Specialization',
    'langLevel': 'Language proficiency',
}


def registration_rows(instance):
    """Read every persisted public column, including future model field additions."""
    rows = [('Reference', f'#{instance.pk}')]
    if hasattr(instance, 'created_at'):
        moment = instance.created_at
    else:
        moment = getattr(instance, 'createdAt', None)
    if moment:
        rows.append(('Submitted at (UTC)', moment.astimezone(timezone.utc).strftime('%Y-%m-%d %H:%M UTC')))
    for field in instance._meta.concrete_fields:
        if field.name in NOTIFICATION_FIELD_NAMES:
            continue
        value = getattr(instance, field.name)
        if isinstance(value, FieldFile):
            value = value.name or ''
        elif value is None:
            value = ''
        rows.append((LABELS.get(field.name, field.verbose_name.title()), str(value)))
    return rows


def admin_recipients():
    addresses = [v.strip() for v in os.getenv('REGISTRATION_ADMIN_EMAILS', 'info@novanestholding.com').split(',') if v.strip()]
    for address in addresses:
        validate_email(address)
    return list(dict.fromkeys(addresses))


def build_registration_email(instance, kind, role, recipients):
    reference = f'#{instance.pk}'
    first = (getattr(instance, 'your_first_name', '') or getattr(instance, 'firstName', '')).strip()
    if role == 'admin':
        subject = f'[NovaNest Holding] New {kind} {reference}'
        title = f'New {kind}'
        intro = 'A new submission has been saved in the NovaNest Holding database. All recorded form fields are listed below.'
        note = 'For internal review. Handle personal data and attached CVs confidentially.'
        language = 'en'
        reply_to = [instance.email]
    elif instance.submission_language == 'fa':
        subject = f'نووانست هلدینگ | دریافت درخواست {reference}'
        title = 'درخواست شما دریافت شد'
        intro = f'{first} عزیز، درخواست شما با شماره پیگیری {reference} ثبت شده و در انتظار بررسی است.'
        note = 'این پیام صرفاً تأیید دریافت اطلاعات است و به معنی تأیید یا پذیرش نهایی نیست.'
        language = 'fa'
        reply_to = ['info@novanestholding.com']
    else:
        subject = f'[NovaNest Holding] Your {kind} was received {reference}'
        title = 'We received your submission'
        intro = f'Dear {first}, we have recorded your {kind} submission as {reference}. Our team will review it.'
        note = 'This confirms receipt only, not acceptance or an appointment booking.'
        language = 'en'
        reply_to = ['info@novanestholding.com']
    plain, html = render_standard_email(title=title, intro=intro, rows=registration_rows(instance),
                                       note=note, language=language, preheader=subject)
    mail = EmailMultiAlternatives(subject=subject, body=plain,
                                  from_email=settings.DEFAULT_FROM_EMAIL, to=recipients,
                                  reply_to=reply_to)
    mail.attach_alternative(html, 'text/html')
    # A CV submitted by a job/trainee applicant is stored privately in media
    # and attached to the *admin* notification only, never to public previews.
    cv_file = getattr(instance, 'cvFile', None)
    if role == 'admin' and cv_file and cv_file.name:
        try:
            cv_file.open('rb')
            try:
                mail.attach(os.path.basename(cv_file.name), cv_file.read(), 'application/octet-stream')
            finally:
                cv_file.close()
        except Exception:
            log.exception('Unable to attach CV to %s notification %s', kind, reference)
            raise
    return mail


def notify_registration(instance, kind):
    try:
        administrators = admin_recipients()
    except Exception:
        log.exception('Invalid REGISTRATION_ADMIN_EMAILS for %s %s', kind, instance.pk)
        administrators = []
    failed = []
    for column, role, addresses in [
        ('admin_notified', 'admin', administrators),
        ('applicant_notified', 'applicant', [instance.email]),
    ]:
        if getattr(instance, column):
            continue
        try:
            if not addresses:
                raise ValueError('No destination for registration notification')
            count = build_registration_email(instance, kind, role, addresses).send(fail_silently=False)
            if count != 1:
                raise RuntimeError('Provider did not accept the registration email')
            setattr(instance, column, True)
            instance.save(update_fields=[column])
        except Exception:
            log.exception('%s %s: %s email failed', kind, instance.pk, role)
            failed.append(column)
    instance.notification_error = ','.join(failed)
    instance.save(update_fields=['notification_error'])
    return not failed
