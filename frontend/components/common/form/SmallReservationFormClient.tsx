'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Input from '@/components/common/form/Input';
import FormTitle from '@/components/common/form/FormTitle';
import { UnifiedFormSubmit, UnifiedFormStatus, type SubmissionStatus } from '@/components/common/form/UnifiedFormSubmit';
import { SubmitSmallReservationForm, type ConsultationPayload } from '../../../pages/api/small-reservation';

type FormValues = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
};

type Labels = {
  formTitle: string;
  formSubtitle: string;
  sendingButton: string;
  ReserveButton: string;
  sendButton: string;
  successMessage: string;
  failedMessage: string;
  firstName: string;
  firstNameRequired: string;
  firstNamePlaceholder: string;
  lastName: string;
  lastNameRequired: string;
  lastNamePlaceholder: string;
  email: string;
  emailRequired: string;
  emailErrorMessage: string;
  emailPlaceholder: string;
  phoneNumber: string;
  phoneNumberRequired: string;
  phoneNumberErrorMessage: string;
  phoneNumberPlaceholder: string;
};

type Props = { lang: string; translations: Labels; subject: string };
type Result = { kind: SubmissionStatus; message: string };
const knownServices = ['investment', 'acceleration', 'entrepreneur-pnp', 'startup'] as const;
function isService(value: string): value is ConsultationPayload['service'] {
  return knownServices.some(service => service === value);
}

export default function SmallReservationFormClient({ lang, translations, subject }: Props) {
  const locale: 'fa' | 'en' = lang === 'fa' ? 'fa' : 'en';
  const { register, handleSubmit, setError, reset, formState: { errors, isSubmitting } } = useForm<FormValues>({
    mode: 'onBlur',
    reValidateMode: 'onChange',
    defaultValues: { firstName: '', lastName: '', email: '', phoneNumber: '' },
  });
  const [result, setResult] = useState<Result | null>(null);

  const submit = async (values: FormValues) => {
    setResult(null);
    if (!isService(subject)) {
      setResult({ kind: 'error', message: translations.failedMessage });
      return;
    }
    const payload: ConsultationPayload = {
      service: subject,
      first_name: values.firstName.trim(),
      last_name: values.lastName.trim(),
      email: values.email.trim(),
      phone_number: values.phoneNumber.trim(),
      language: locale,
    };
    try {
      const response = await SubmitSmallReservationForm(payload);
      const reference = response.data?.reference;
      if ((response.status !== 201 && response.status !== 202) || reference == null) {
        throw new Error(translations.failedMessage);
      }
      reset();
      if (response.status === 202 || response.data.notifications_sent !== true) {
        setResult({
          kind: 'pending',
          message: locale === 'fa'
            ? `درخواست شما با شماره پیگیری #${reference} ثبت شد، اما ارسال بعضی ایمیل‌ها در انتظار بررسی است. لطفاً دوباره ثبت نکنید.`
            : `Your request #${reference} was saved, but some email notifications are pending. Please do not submit again.`,
        });
      } else {
        setResult({
          kind: 'success',
          message: locale === 'fa'
            ? `درخواست مشاوره شما با شماره پیگیری #${reference} ثبت شد. این پیام تأیید دریافت درخواست است، نه رزرو قطعی زمان مشاوره.`
            : `We received your consultation request (#${reference}). This confirms receipt, not a booked appointment.`,
        });
      }
    } catch (error) {
      const api = error as { response?: { status?: number; data?: Record<string, unknown> } };
      if (api.response?.status === 400 && api.response.data) {
        const fields: Record<string, keyof FormValues> = {
          first_name: 'firstName', last_name: 'lastName',
          email: 'email', phone_number: 'phoneNumber',
        };
        for (const [backendKey, localKey] of Object.entries(fields)) {
          const fieldError = api.response.data[backendKey];
          if (fieldError) {
            setError(localKey, { type: 'server', message: Array.isArray(fieldError)
              ? String(fieldError[0]) : String(fieldError) });
          }
        }
      }
      const message = api.response?.status === 429
        ? locale === 'fa'
          ? 'تعداد درخواست‌ها بیش از حد مجاز است. لطفاً بعداً تلاش کنید.'
          : 'Too many requests. Please try again later.'
        : translations.failedMessage;
      setResult({ kind: 'error', message });
      // Do not clear entered values on failure.
    }
  };

  return (
    <div className="w-full max-w-responsive mx-auto" dir={locale === 'fa' ? 'rtl' : 'ltr'}>
      <div className="h-[100px] md:h-[125px]">
        <FormTitle formTitle={translations.formTitle} formSubtitle={translations.formSubtitle} />
      </div>
      <form onSubmit={handleSubmit(submit, () => setResult(null))} noValidate className="w-full">
        <div className="mb-6 grid grid-cols-1 gap-6 mt-10 md:grid-cols-2 xl:grid-cols-3">
          <div>
            <Input id="consultation-first-name" register={register} errors={errors}
              nameInput="firstName" type="text" label={translations.firstName}
              required={translations.firstNameRequired} patternValue="" patternMessage=""
              placeholder={translations.firstNamePlaceholder} className="input mb-1 w-full" />
          </div>
          <div>
            <Input id="consultation-last-name" register={register} errors={errors}
              nameInput="lastName" type="text" label={translations.lastName}
              required={translations.lastNameRequired} patternValue="" patternMessage=""
              placeholder={translations.lastNamePlaceholder} className="input mb-1 w-full" />
          </div>
          <div>
            <Input id="consultation-email" register={register} errors={errors}
              nameInput="email" type="email" label={translations.email}
              required={translations.emailRequired}
              patternValue={String.raw`^[^\s@]+@[^\s@]+\.[^\s@]+$`}
              patternMessage={translations.emailErrorMessage}
              placeholder={translations.emailPlaceholder} className="input mb-1 w-full" />
          </div>
          <div>
            <Input id="consultation-phone" register={register} errors={errors}
              nameInput="phoneNumber" type="tel" label={translations.phoneNumber}
              required={translations.phoneNumberRequired} patternValue="" patternMessage=""
              placeholder={translations.phoneNumberPlaceholder} className="input mb-1 w-full" />
          </div>
        </div>
        <div className="mx-auto pb-4 mt-20 flex justify-center">
          <UnifiedFormSubmit lang={locale} label={translations.ReserveButton}
            loadingLabel={translations.sendingButton} busy={isSubmitting}
            className="w-44 md:w-52" />
        </div>
      </form>
      <div className="mx-auto max-w-xl">
        <UnifiedFormStatus status={result?.kind ?? null} message={result?.message} />
      </div>
    </div>
  );
}
