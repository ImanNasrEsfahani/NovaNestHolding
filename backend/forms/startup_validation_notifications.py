"""Two independent, bilingual Startup Validation emails, rendered by default_email.html.

Data is stored first. Accepted emails are never re-sent on admin retry.
Microsoft Graph acceptance is not a guarantee of final mailbox delivery.
"""
import logging
from datetime import timezone as datetime_timezone
from pathlib import PurePosixPath

from django.conf import settings
from django.core.mail import EmailMultiAlternatives

from .email_service import render_standard_email

logger = logging.getLogger(__name__)
ADMIN_EMAIL = 'info@novanestholding.com'

# The public form offers distinct form sections. Preserve their actual field
# values in the manager's message without claiming any missing field was filled.
DETAIL_FIELDS = (
    ('firstName', 'First name', 'نام'),
    ('lastName', 'Last name', 'نام خانوادگی'),
    ('email', 'Email', 'ایمیل'),
    ('phoneNumber', 'Phone number', 'شماره تماس'),
    ('countryOfResidence', 'Country of residence', 'کشور محل اقامت'),
    ('provinceOfResidence', 'Province / state', 'استان'),
    ('cityOfResidence', 'City of residence', 'شهر'),
    ('startupType', 'Startup stage', 'مرحله استارتاپ'),
    ('productName', 'Startup / product name', 'نام استارتاپ یا محصول'),
    ('siteAddress', 'Website', 'وب‌سایت'),
    ('customerProblem', 'Customer problem', 'مسئله مشتری'),
    ('uniqueValueProposition', 'Unique value proposition', 'ارزش پیشنهادی منحصربه‌فرد'),
    ('technologyReadinessLevel', 'Technology readiness level', 'سطح آمادگی فناوری'),
    ('solution', 'Solution', 'راهکار'),
    ('productLevel', 'Product level', 'مرحله توسعه محصول'),
    ('scalable', 'Scalability', 'مقیاس‌پذیری'),
    ('monetizationOfYourPlan', 'Business model / monetization', 'مدل کسب‌وکار و درآمدزایی'),
    ('structureOfYourSales', 'Sales structure', 'ساختار فروش'),
    ('customerCharacteristic', 'Target customers', 'مشتریان هدف'),
    ('currentCustomers', 'Current customers', 'مشتریان فعلی'),
    ('estimatedMarketSize', 'Estimated market size', 'اندازه تخمینی بازار'),
    ('totalTamSamSom', 'TAM / SAM / SOM', 'کل بازار / بازار قابل‌دستیابی'),
    ('startupRevenue', 'Startup revenue', 'درآمد استارتاپ'),
    ('monthlyIncome', 'Monthly income', 'درآمد ماهانه'),
    ('currentInterestRate', 'Current interest rate', 'نرخ بهره فعلی'),
    ('currentRaisedFunding', 'Funding raised so far', 'سرمایه جذب‌شده تاکنون'),
    ('neededCapital', 'Capital required', 'سرمایه موردنیاز'),
    ('cooperatedWithInvestors', 'Previous investor / accelerator cooperation', 'همکاری قبلی با سرمایه‌گذار یا شتاب‌دهنده'),
    ('howDidYouKnowUs', 'How did you hear about us?', 'نحوه آشنایی با ما'),
    ('ideaExplanation', 'Idea explanation', 'توضیح ایده'),
    ('getToKnowUs', 'Additional referral information', 'اطلاعات تکمیلی آشنایی'),
    ('type', 'Type', 'نوع'),
    ('birthDate', 'Date of birth', 'تاریخ تولد'),
)
FILES = (
    ('pitchDeckFile', 'Pitch deck', 'فایل معرفی استارتاپ'),
    ('businessPlanFile', 'Business plan', 'طرح کسب‌وکار'),
    ('financialFile', 'Financial document', 'فایل مالی'),
    ('financialModelFile', 'Financial model', 'مدل مالی'),
)


def _value(raw):
    if raw is None:
        return ''
    if hasattr(raw, 'name') and not isinstance(raw, str):
        raw = raw.name
    return str(raw).strip()


def _rows_for_admin(startup, language):
    fa = language == 'fa'
    rows = [
        ('شماره پیگیری' if fa else 'Submission reference', str(startup.pk)),
        ('نام کامل' if fa else 'Full name',
         f'{startup.firstName} {startup.lastName}'.strip()),
    ]
    for attribute, en_label, fa_label in DETAIL_FIELDS:
        raw = _value(getattr(startup, attribute, None))
        if raw:
            rows.append((fa_label if fa else en_label, raw))
    for attribute, en_label, fa_label in FILES:
        file_name = _value(getattr(startup, attribute, None))
        if file_name:
            # File attachments are stored by Django and NOT emailed or exposed
            # as publicly accessible media URLs. The manager can inspect the
            # saved submission through Django Admin.
            rows.append(((fa_label if fa else en_label) +
                         (' (نام فایل)' if fa else ' (stored filename)'),
                         PurePosixPath(file_name.replace('\\', '/')).name))
    if getattr(startup, 'createdAt', None):
        stamp = startup.createdAt.astimezone(datetime_timezone.utc).strftime('%Y-%m-%d %H:%M UTC')
        rows.append(('زمان ثبت (UTC)' if fa else 'Submitted at (UTC)', stamp))
    rows.append(('صفحه مبدأ' if fa else 'Source page',
                 f'https://www.novanestholding.com/{language}/startups-validation'))
    return rows


def startup_validation_email(startup, role, recipients):
    """Return one bilingual HTML+plaintext email for one explicitly chosen role."""
    language = 'fa' if startup.submission_language == 'fa' else 'en'
    fa = language == 'fa'
    name = f'{startup.firstName} {startup.lastName}'.strip()
    ref = f'#{startup.pk}'
    if role == 'applicant':
        if fa:
            subject = f'نووانست هلدینگ | تأیید دریافت درخواست استارتاپ {ref}'
            title = 'درخواست ارزیابی استارتاپ شما دریافت شد'
            intro = f'{name} عزیز، از ثبت درخواست ارزیابی استارتاپ در نووانست هلدینگ سپاسگزاریم.'
            message = ('اطلاعات شما با موفقیت ثبت شد و تیم ما آن را بررسی خواهد کرد. '
                       'در صورت نیاز به اطلاعات بیشتر، با شما تماس خواهیم گرفت.')
            note = 'این ایمیل صرفاً تأیید دریافت درخواست است و به معنی تأیید یا پذیرش استارتاپ نیست.'
            rows = [
                ('شماره پیگیری', str(startup.pk)),
                ('نام متقاضی', name),
                ('ایمیل', startup.email),
                ('نام استارتاپ / محصول', startup.productName or 'ثبت نشده'),
                ('مرحله استارتاپ', startup.startupType or 'ثبت نشده'),
            ]
        else:
            subject = f'[NovaNest Holding] Startup validation request received {ref}'
            title = 'Startup validation application received'
            intro = f'Dear {name}, thank you for submitting your startup validation application to NovaNest Holding.'
            message = ('Your application has been saved and our team will review it. '
                       'We will contact you if additional information is required.')
            note = 'This email confirms receipt of your application; it does not mean approval or acceptance.'
            rows = [
                ('Reference', str(startup.pk)),
                ('Applicant', name),
                ('Email', startup.email),
                ('Startup / product', startup.productName or 'Not provided'),
                ('Startup stage', startup.startupType or 'Not provided'),
            ]
        reply_to = [settings.DEFAULT_FROM_EMAIL]
    elif role == 'admin':
        if fa:
            subject = f'نووانست هلدینگ | درخواست جدید ارزیابی استارتاپ {ref} — {name}'
            title = 'درخواست جدید ارزیابی استارتاپ'
            intro = f'یک درخواست جدید از صفحه فارسی ارزیابی استارتاپ ثبت شده است. متقاضی: {name}.'
            message = 'اطلاعات ثبت‌شده برای بررسی در ادامه آمده است.'
            note = ('اطلاع‌رسانی داخلی. اطلاعات متقاضی محرمانه است. '
                    'فایل‌ها در دیتابیس/فضای ذخیره‌سازی ثبت شده‌اند و پیوست این ایمیل نیستند.')
        else:
            subject = f'[NovaNest Holding] New startup validation application {ref} — {name}'
            title = 'New startup validation application'
            intro = f'A new startup validation application was submitted by {name}.'
            message = 'The applicant details and all submitted nonempty fields are listed below.'
            note = ('Internal notification. Handle applicant data confidentially. '
                    'Uploaded files are stored with the submission; they are not attached to this email.')
        rows = _rows_for_admin(startup, language)
        reply_to = [startup.email]
    else:
        raise ValueError('Unsupported Startup Validation email role')

    plain, html = render_standard_email(
        title=title, intro=intro, message=message, rows=rows,
        note=note, language=language, preheader=subject,
    )
    mail = EmailMultiAlternatives(
        subject=subject, body=plain, from_email=settings.DEFAULT_FROM_EMAIL,
        to=list(recipients), reply_to=reply_to,
    )
    mail.attach_alternative(html, 'text/html')
    return mail


def notify_startup_validation(startup):
    """Save acceptance for each recipient independently; retry only unsent roles."""
    targets = (
        ('applicant_notified', 'applicant', [startup.email]),
        ('admin_notified', 'admin', [ADMIN_EMAIL]),
    )
    pending = []
    for flag, role, recipients in targets:
        if getattr(startup, flag):
            continue
        try:
            if not recipients or not all(recipients):
                raise ValueError('Missing email recipient')
            accepted = startup_validation_email(startup, role, recipients).send(fail_silently=False)
            if accepted != 1:
                raise RuntimeError('Mail provider did not accept the message')
            setattr(startup, flag, True)
            startup.save(update_fields=[flag])
        except Exception:
            logger.exception('Startup Validation #%s: %s email not accepted', startup.pk, role)
            pending.append(flag)
    startup.notification_error = ','.join(pending)
    startup.save(update_fields=['notification_error'])
    return not pending
