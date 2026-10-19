'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import TextArea from '@/components/common/TextArea';
import FormTitle from '@/components/common/form/FormTitle';
import Input from '@/components/common/form/Input';
import ButtonRefactor from '@/components/common/ButtonRefactor';

type Fields = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  message: string;
};

type Labels = {
  formTitle: string;
  formSubtitle: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  message: string;
  firstNameRequired: string;
  lastNameRequired: string;
  emailRequired: string;
  phoneNumberRequired: string;
  messageRequired: string;
  sendButton: string;
  sendingButton: string;
  successMessage: string;
  failedMessage: string;
};

type SubmitResult = { kind: 'success' | 'pending' | 'error'; message: string };

export default function AffiliateContactForm({ affiliateName, affiliateSlug, labels }: {
  affiliateName: string;
  affiliateSlug: string;
  labels: Labels;
}) {
  const { register, handleSubmit, reset, setError, formState: { errors, isSubmitting } } = useForm<Fields>({
    mode: 'onBlur',
    defaultValues: { firstName: '', lastName: '', email: '', phoneNumber: '', message: '' }
  });
  const [result, setResult] = useState<SubmitResult | null>(null);

  const onSubmit = async (form: Fields) => {
    setResult(null);
    // Use the current route language; the profile page is available in both locales.
    const language = window.location.pathname.startsWith('/fa/') ? 'fa' : 'en';
    const base = (process.env.NEXT_PUBLIC_DJANGO_HOST_URL || 'https://back.novanestholding.com').replace(/\/+$/, '');
    const payload = {
      first_name: form.firstName.trim(),
      last_name: form.lastName.trim(),
      email: form.email.trim(),
      phone_number: form.phoneNumber.trim(),
      message: form.message.trim(),
      language,
    };

    try {
      // The trusted backend registry resolves the affiliate's primary recipient;
      // no email address, affiliate name or admin recipient is taken from the client.
      const response = await fetch(`${base}/affiliate-inquiries/${encodeURIComponent(affiliateSlug)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await response.json().catch(() => ({}));

      if (response.status === 400) {
        const fieldNames: Record<string, keyof Fields> = {
          first_name: 'firstName',
          last_name: 'lastName',
          email: 'email',
          phone_number: 'phoneNumber',
          message: 'message',
        };
        for (const [backendField, clientField] of Object.entries(fieldNames)) {
          const errorValue = data[backendField];
          if (errorValue) {
            const message = Array.isArray(errorValue) ? String(errorValue[0]) : String(errorValue);
            setError(clientField, { type: 'server', message });
          }
        }
        throw new Error(labels.failedMessage);
      }
      if (response.status === 429) {
        throw new Error(language === 'fa'
          ? 'تعداد درخواست‌ها بیش از حد مجاز است. لطفاً بعداً تلاش کنید.'
          : 'Too many requests. Please try again later.');
      }
      if (!response.ok) throw new Error(labels.failedMessage);

      const reference = String(data.reference ?? '');
      reset();
      if (response.status === 202) {
        setResult({
          kind: 'pending',
          message: language === 'fa'
            ? `پیام شما با شماره پیگیری ${reference} ثبت شد، اما ارسال بعضی ایمیل‌ها در انتظار بررسی است. لطفاً دوباره ثبت نکنید.`
            : `Your inquiry was saved (reference ${reference}), but some email notifications are pending. Please do not resubmit.`,
        });
      } else {
        setResult({
          kind: 'success',
          message: `${labels.successMessage}${reference ? ` (#${reference})` : ''}`,
        });
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
          <Input id="affiliate-first-name" nameInput="firstName" register={register} errors={errors} type="text"
            label={labels.firstName} required={labels.firstNameRequired} patternValue="" patternMessage=""
            placeholder={labels.firstName} className="input col-span-1 mb-1 w-full" />
          <Input id="affiliate-last-name" nameInput="lastName" register={register} errors={errors} type="text"
            label={labels.lastName} required={labels.lastNameRequired} patternValue="" patternMessage=""
            placeholder={labels.lastName} className="input col-span-1 mb-1 w-full" />
          <Input id="affiliate-email" nameInput="email" register={register} errors={errors} type="email"
            label={labels.email} required={labels.emailRequired} patternValue="^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$" patternMessage={labels.emailRequired}
            placeholder="name@example.com" className="input col-span-1 mb-1 w-full" />
          <Input id="affiliate-phone" nameInput="phoneNumber" register={register} errors={errors} type="tel"
            label={labels.phoneNumber} required={labels.phoneNumberRequired} patternValue="" patternMessage=""
            placeholder={labels.phoneNumber} className="input col-span-1 mb-1 w-full" />
        </div>
        <TextArea title={labels.message} register={register} errors={errors} required={labels.messageRequired}
          nameTextArea="message" patternValue="" patternMessage="" placeholder={labels.message}
          maxLength={1300} maxLengthMessage="1300 characters maximum" validate="" />
        <div className="mx-auto mt-8 pb-2">
          <ButtonRefactor type="submit" text={isSubmitting ? labels.sendingButton : labels.sendButton} disabled={isSubmitting} />
        </div>
        {result && (
          <p role="status" aria-live="polite" className={`mx-auto mt-5 max-w-xl rounded-lg p-4 text-center text-sm ${
            result.kind === 'error' ? 'border border-red-300 bg-red-50 text-red-800'
              : result.kind === 'pending' ? 'border border-amber-300 bg-amber-50 text-amber-900'
                : 'border border-green-300 bg-green-50 text-green-800'
          }`}>
            {result.message}
          </p>
        )}
      </form>
    </div>
  );
}
