'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { en, fa } from './AffiliateApplicationTranslations';

type Answers = {
  full_name: string;
  phone_number: string;
  email: string;
  position: string;
  years_of_experience: string;
  industry_field: string;
  education_degree: string;
  language_level: string;
  assets_range: string;
  traveled_to_canada: string;
  visa_rejected: string;
};

type Props = { slug: string; affiliateName: string; lang?: string };
const fieldClass = 'mt-2 block w-full rounded-xl border border-[#D7D3CB] bg-white px-4 py-3 text-[15px] text-[#26324B] shadow-sm outline-none transition-colors placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20';
const labelClass = 'block text-sm font-semibold text-[#26324B]';
const errorClass = 'mt-1.5 text-xs font-medium text-red-700';

function Required({ isFa }: { isFa: boolean }) {
  return <span className={`${isFa ? 'mr-1' : 'ml-1'} text-[#A46232]`} aria-hidden="true">*</span>;
}
function FieldError({ text, id }: { text?: string; id: string }) {
  return text ? <p id={id} role="alert" className={errorClass}>{text}</p> : null;
}

export default function AffiliateApplicationForm({ slug, affiliateName, lang = 'en' }: Props) {
  const isFa = lang === 'fa';
  const t = isFa ? fa : en;
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<Answers>({
    mode: 'onBlur',
    reValidateMode: 'onChange',
    shouldFocusError: true,
    defaultValues: {
      position: '', years_of_experience: '', industry_field: '', assets_range: '',
      traveled_to_canada: '', visa_rejected: ''
    }
  });
  const [status, setStatus] = useState<{ kind: 'success' | 'error' | 'pending'; message: string } | null>(null);

  async function submit(values: Answers) {
    setStatus(null);
    try {
      const base = (process.env.NEXT_PUBLIC_DJANGO_HOST_URL || 'https://back.novanestholding.com').replace(/\/+$/, '');
      const payload = {
        ...values,
        phone_number: values.phone_number.replace(/[\s()-]/g, ''),
        traveled_to_canada: values.traveled_to_canada === 'true',
        visa_rejected: values.visa_rejected === 'true',
        industry_field: values.industry_field.trim()
      };
      // The API resolves the destination email from its read-only registry; no recipient is submitted.
      const response = await fetch(`${base}/affiliate-applications/${encodeURIComponent(slug)}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        if (response.status === 429) throw new Error(t.tooMany);
        if (response.status === 400) throw new Error(t.checkAnswers);
        throw new Error(t.unable);
      }
      reset();
      if (response.status === 202) {
        setStatus({ kind: 'pending', message: `${t.pendingPrefix}${data.reference}${t.pendingSuffix}` });
      } else {
        setStatus({ kind: 'success', message: isFa
          ? `${t.successPrefix}${data.reference}${t.successSuffix}${affiliateName} به اشتراک گذاشته شد.`
          : `${t.successPrefix}${data.reference}${t.successSuffix}${affiliateName}.` });
      }
    } catch (error) {
      setStatus({ kind: 'error', message: error instanceof Error ? error.message : t.failed });
    }
  }

  const yesNo = (name: 'traveled_to_canada' | 'visa_rejected', legend: string) => (
    <fieldset className="min-w-0">
      <legend className={labelClass}>{legend}<Required isFa={isFa} /></legend>
      <div className="mt-3 flex flex-wrap gap-3">
        {([['true', t.yes], ['false', t.no]] as const).map(([value, title]) => (
          <label key={value} className="flex min-w-[108px] cursor-pointer items-center gap-2.5 rounded-xl border border-[#D7D3CB] bg-white px-4 py-3 text-sm text-[#26324B] has-[:checked]:border-primary has-[:checked]:bg-[#F8F5F0] has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-primary">
            <input type="radio" value={value} {...register(name, { required: t.yesNoRequired })} className="h-4 w-4 accent-[#AA8453]" />
            {title}
          </label>
        ))}
      </div>
      <FieldError id={`${name}-error`} text={errors[name]?.message} />
    </fieldset>
  );

  return (
    <form noValidate onSubmit={handleSubmit(submit)} aria-label={t.formAria}
      className="mx-auto w-full max-w-4xl space-y-8" dir={isFa ? 'rtl' : 'ltr'}>
      <section className="overflow-hidden rounded-2xl border border-[#E7DDD1] bg-white shadow-sm">
        <div className="border-b border-[#EEE5DC] bg-[#FAF8F5] px-5 py-5 sm:px-8">
          <p className="text-xs font-bold uppercase tracking-[.16em] text-primary">01 / {t.section1}</p>
          <h2 className="mt-1 font-header text-xl font-semibold text-[#1D2942]">{t.section1Title}</h2>
        </div>
        <div className="grid gap-5 px-5 py-6 sm:grid-cols-2 sm:px-8">
          <div>
            <label htmlFor="aff-full-name" className={labelClass}>{t.fullName}<Required isFa={isFa} /></label>
            <input id="aff-full-name" autoComplete="name" type="text" placeholder={t.fullNamePlaceholder}
              className={fieldClass} maxLength={180} aria-invalid={!!errors.full_name} aria-describedby={errors.full_name ? 'full_name-error' : undefined}
              {...register('full_name', { required: t.fullNameRequired, maxLength: 180 })} />
            <FieldError id="full_name-error" text={errors.full_name?.message} />
          </div>
          <div>
            <label htmlFor="aff-phone" className={labelClass}>{t.phone}<Required isFa={isFa} /></label>
            <input id="aff-phone" autoComplete="tel" type="tel" inputMode="tel" dir="ltr" placeholder={t.phonePlaceholder}
              className={fieldClass} aria-invalid={!!errors.phone_number}
              {...register('phone_number', { required: t.phoneRequired, validate: v => /^\+[1-9]\d{7,14}$/.test(v.replace(/[\s()-]/g, '')) || t.phoneInvalid })} />
            <FieldError id="phone_number-error" text={errors.phone_number?.message} />
          </div>
          <div>
            <label htmlFor="aff-email" className={labelClass}>{t.email}<Required isFa={isFa} /></label>
            <input id="aff-email" autoComplete="email" type="email" inputMode="email" dir="ltr" placeholder={t.emailPlaceholder}
              className={fieldClass} aria-invalid={!!errors.email}
              {...register('email', { required: t.emailRequired, pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: t.emailInvalid } })} />
            <FieldError id="email-error" text={errors.email?.message} />
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-[#E7DDD1] bg-white shadow-sm">
        <div className="border-b border-[#EEE5DC] bg-[#FAF8F5] px-5 py-5 sm:px-8">
          <p className="text-xs font-bold uppercase tracking-[.16em] text-primary">02 / {t.section2}</p>
          <h2 className="mt-1 font-header text-xl font-semibold text-[#1D2942]">{t.section2Title}</h2>
        </div>
        <div className="grid gap-5 px-5 py-6 sm:grid-cols-2 sm:px-8">
          <div>
            <label htmlFor="aff-position" className={labelClass}>{t.position}<Required isFa={isFa} /></label>
            <select id="aff-position" className={fieldClass} defaultValue="" aria-invalid={!!errors.position}
              aria-describedby={errors.position ? 'position-error' : undefined}
              {...register('position', { required: t.positionRequired })}>
              <option value="" disabled>{t.positionPlaceholder}</option>
              <option value="owner">{t.owner}</option>
              <option value="owner_ceo">{t.ownerCeo}</option>
              <option value="ceo">{t.ceo}</option>
              <option value="senior_manager">{t.seniorManager}</option>
              <option value="other">{t.other}</option>
            </select>
            <FieldError id="position-error" text={errors.position?.message} />
          </div>
          <div>
            <label htmlFor="aff-years" className={labelClass}>{t.years}<Required isFa={isFa} /></label>
            <select id="aff-years" className={fieldClass} defaultValue="" aria-invalid={!!errors.years_of_experience}
              aria-describedby={errors.years_of_experience ? 'years_of_experience-error' : undefined}
              {...register('years_of_experience', { required: t.yearsRequired })}>
              <option value="" disabled>{t.yearsPlaceholder}</option>
              <option value="under_5">{t.under5}</option>
              <option value="5_10">{t.fiveToTen}</option>
              <option value="10_20">{t.tenToTwenty}</option>
              <option value="20_plus">{t.over20}</option>
            </select>
            <FieldError id="years_of_experience-error" text={errors.years_of_experience?.message} />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="aff-industry" className={labelClass}>{t.industry}<Required isFa={isFa} /></label>
            <input id="aff-industry" type="text" maxLength={180} placeholder={t.industryPlaceholder}
              className={fieldClass} aria-invalid={!!errors.industry_field}
              aria-describedby={errors.industry_field ? 'industry_field-error' : undefined}
              {...register('industry_field', {
                required: t.industryRequired,
                validate: value => Boolean(value.trim()) || t.industryRequired
              })} />
            <FieldError id="industry_field-error" text={errors.industry_field?.message} />
          </div>
          <div>
            <label htmlFor="aff-education" className={labelClass}>{t.education}<Required isFa={isFa} /></label>
            <select id="aff-education" className={fieldClass} defaultValue="" aria-invalid={!!errors.education_degree}
              {...register('education_degree', { required: t.educationRequired })}>
              <option value="" disabled>{t.educationPlaceholder}</option>
              <option value="high_school">{t.highSchool}</option>
              <option value="bachelor">{t.bachelor}</option>
              <option value="master">{t.master}</option>
              <option value="phd">{t.phd}</option>
            </select>
            <FieldError id="education_degree-error" text={errors.education_degree?.message} />
          </div>
          <div>
            <label htmlFor="aff-language" className={labelClass}>{t.language}<Required isFa={isFa} /></label>
            <select id="aff-language" className={fieldClass} defaultValue="" aria-invalid={!!errors.language_level}
              {...register('language_level', { required: t.languageRequired })}>
              <option value="" disabled>{t.languagePlaceholder}</option>
              <option value="none">{t.none}</option><option value="basic">{t.basic}</option>
              <option value="intermediate">{t.intermediate}</option><option value="advanced">{t.advanced}</option>
            </select>
            <FieldError id="language_level-error" text={errors.language_level?.message} />
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-[#E7DDD1] bg-white shadow-sm">
        <div className="border-b border-[#EEE5DC] bg-[#FAF8F5] px-5 py-5 sm:px-8">
          <p className="text-xs font-bold uppercase tracking-[.16em] text-primary">03 / {t.section3}</p>
          <h2 className="mt-1 font-header text-xl font-semibold text-[#1D2942]">{t.section3Title}</h2>
        </div>
        <div className="space-y-7 px-5 py-6 sm:px-8">
          <div>
            <label htmlFor="aff-assets-range" className={labelClass}>{t.assets}<Required isFa={isFa} /></label>
            <p className="mt-1 text-xs text-gray-500">{t.assetsInfo}</p>
            <select id="aff-assets-range" className={fieldClass} defaultValue="" aria-invalid={!!errors.assets_range}
              aria-describedby={errors.assets_range ? 'assets_range-error' : undefined}
              {...register('assets_range', { required: t.assetsRequired })}>
              <option value="" disabled>{t.assetsPlaceholder}</option>
              <option value="under_300k">{t.under300}</option>
              <option value="300k_500k">{t.threeToFive}</option>
              <option value="500k_1m">{t.fiveToMillion}</option>
              <option value="1m_plus">{t.overMillion}</option>
            </select>
            <FieldError id="assets_range-error" text={errors.assets_range?.message} />
          </div>
          {yesNo('traveled_to_canada', t.travel)}
          {yesNo('visa_rejected', t.visa)}
        </div>
      </section>

      <div className="rounded-2xl border border-[#E7DDD1] bg-[#F8F5F0] px-5 py-6 sm:px-8">
        <button type="submit" disabled={isSubmitting}
          className="mt-6 inline-flex w-full items-center justify-center gap-3 rounded-xl bg-primary px-6 py-4 text-base font-semibold text-white shadow-sm transition-colors hover:bg-[#8D6B40] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary disabled:cursor-wait disabled:opacity-60 sm:w-auto sm:min-w-[260px]">
          {isSubmitting ? t.submitting : t.submit} <span aria-hidden="true">{isFa ? '←' : '→'}</span>
        </button>
        {status && (
          <div role="status" aria-live="polite" className={`mt-5 rounded-xl px-4 py-3 text-sm ${status.kind === 'error' ? 'border border-red-300 bg-red-50 text-red-800' : 'border border-green-300 bg-green-50 text-green-900'}`}>
            {status.message}
          </div>
        )}
      </div>
    </form>
  );
}
