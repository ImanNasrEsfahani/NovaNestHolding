'use client';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import TextArea from '@/components/common/TextArea';
import { UnifiedFormSubmit, UnifiedFormStatus } from '@/components/common/form/UnifiedFormSubmit';
import FormTitle from '@/components/common/form/FormTitle';
import Input from '@/components/common/form/Input';
import { submissionContextHeader } from '@/utils/formContext';

type Fields = { firstName: string; lastName: string; email: string; phoneNumber: string; message: string };
type Labels = {
  formTitle: string; formSubtitle: string; firstName: string; lastName: string;
  email: string; phoneNumber: string; message: string; firstNameRequired: string;
  lastNameRequired: string; emailRequired: string; emailInvalid: string;
  phoneNumberRequired: string; messageRequired: string; sendButton: string;
  sendingButton: string; successMessage: string; failedMessage: string;
};
type SubmitResult = { kind: 'success' | 'pending' | 'error'; message: string };

export default function AffiliateContactForm({ affiliateName, affiliateSlug, labels, lang = 'en' }: {
  affiliateName: string; affiliateSlug: string; labels: Labels; lang?: 'fa' | 'en';
}) {
  const { register, handleSubmit, reset, setError, formState: { errors, isSubmitting } } = useForm<Fields>({
    mode: 'onBlur', defaultValues: { firstName: '', lastName: '', email: '', phoneNumber: '', message: '' },
  });
  const [result, setResult] = useState<SubmitResult | null>(null);
  // AffiliateProfile may omit lang; after hydration the URL is authoritative.
  const [buttonLanguage, setButtonLanguage] = useState<'fa' | 'en'>(languageFrom(lang));
  useEffect(() => {
    setButtonLanguage(window.location.pathname.startsWith('/fa/') ? 'fa' : 'en');
  }, []);
  const onSubmit = async (form: Fields) => {
    setResult(null);
    // AffiliateProfile currently omits the optional lang prop. Derive the
    // actual form locale from the route, including the two public FA profiles.
    const language = window.location.pathname.startsWith('/fa/') ? 'fa' : 'en';
    const base = (process.env.NEXT_PUBLIC_DJANGO_HOST_URL || 'https://back.novanestholding.com').replace(/\/+$/, '');
    const payload = {
      first_name: form.firstName.trim(), last_name: form.lastName.trim(),
      email: form.email.trim(), phone_number: form.phoneNumber.trim(),
      message: form.message.trim(), language,
    };
    try {
      const context = submissionContextHeader();
      const response = await fetch(`${base}/affiliate-inquiries/${encodeURIComponent(affiliateSlug)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json',
          ...(context ? { 'X-Submission-Context': context } : {}) },
        body: JSON.stringify(payload),
      });
      const data = await response.json().catch(() => ({}));
      if (response.status === 400) {
        const names: Record<string, keyof Fields> = {
          first_name: 'firstName', last_name: 'lastName', email: 'email',
          phone_number: 'phoneNumber', message: 'message',
        };
        for (const [backendField, clientField] of Object.entries(names)) {
          const value = data[backendField];
          if (value) setError(clientField, { type: 'server', message: Array.isArray(value) ? String(value[0]) : String(value) });
        }
        throw new Error(labels.failedMessage);
      }
      if (response.status === 429) throw new Error(language === 'fa'
        ? 'تعداد درخواست‌ها بیش از حد مجاز است. لطفاً بعداً تلاش کنید.'
        : 'Too many requests. Please try again later.');
      if (![201, 202].includes(response.status) || !Number.isInteger(data.reference) || data.reference <= 0) {
        throw new Error(labels.failedMessage);
      }
      reset();
      if (response.status === 202 || data.notifications_sent !== true) {
        setResult({ kind: 'pending', message: language === 'fa'
          ? `پیام شماره ${data.reference} ذخیره شد؛ ارسال برخی ایمیل‌ها در انتظار بررسی است. دوباره ارسال نکنید.`
          : `Your inquiry (#${data.reference}) was saved. Some email notifications are pending; please do not resubmit.` });
      } else {
        setResult({ kind: 'success', message: `${labels.successMessage} (#${data.reference})` });
      }
    } catch (error) {
      setResult({ kind: 'error', message: error instanceof Error ? error.message : labels.failedMessage });
    }
  };
  return (
    <div className="flex w-full flex-col items-center md:items-start">
      <div className="h-[75px] w-full md:h-[125px]">
        <FormTitle formTitle={labels.formTitle} formSubtitle={labels.formSubtitle} />
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="w-full pt-6">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <Input id="affiliate-first-name" nameInput="firstName" register={register} errors={errors}
            type="text" label={labels.firstName} required={labels.firstNameRequired}
            patternValue="" patternMessage="" placeholder={labels.firstName} className="input col-span-1 mb-1 w-full" />
          <Input id="affiliate-last-name" nameInput="lastName" register={register} errors={errors}
            type="text" label={labels.lastName} required={labels.lastNameRequired}
            patternValue="" patternMessage="" placeholder={labels.lastName} className="input col-span-1 mb-1 w-full" />
          <Input id="affiliate-email" nameInput="email" register={register} errors={errors}
            type="email" label={labels.email} required={labels.emailRequired}
            patternValue={String.raw`^[^\s@]+@[^\s@]+\.[^\s@]+$`}
            patternMessage={labels.emailInvalid} placeholder="name@example.com" className="input col-span-1 mb-1 w-full" />
          <Input id="affiliate-phone" nameInput="phoneNumber" register={register} errors={errors}
            type="tel" label={labels.phoneNumber} required={labels.phoneNumberRequired}
            patternValue="" patternMessage="" placeholder={labels.phoneNumber} className="input col-span-1 mb-1 w-full" />
        </div>
        <TextArea title={labels.message} register={register} errors={errors}
          required={labels.messageRequired} nameTextArea="message" patternValue="" patternMessage=""
          placeholder={labels.message} maxLength={1300} maxLengthMessage="1300 characters maximum" validate="" />
        <div className="mx-auto mt-8 flex justify-center pb-2">
          <UnifiedFormSubmit lang={buttonLanguage} label={labels.sendButton}
            loadingLabel={labels.sendingButton} busy={isSubmitting} className="w-44 md:w-52" />
        </div>
        <UnifiedFormStatus status={result?.kind || null} message={result?.message}
          className="mx-auto max-w-xl text-center" />
      </form>
    </div>
  );
}
function languageFrom(lang: string): 'en' | 'fa' { return lang === 'fa' ? 'fa' : 'en'; }
