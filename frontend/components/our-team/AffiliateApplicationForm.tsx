'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';

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
  visa_rejection_details: string;
  consent_to_share: boolean;
};

type Props = { slug: string; affiliateName: string };
const fieldClass = 'mt-2 block w-full rounded-xl border border-[#D7D3CB] bg-white px-4 py-3 text-[15px] text-[#26324B] shadow-sm outline-none transition-colors placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20';
const labelClass = 'block text-sm font-semibold text-[#26324B]';
const errorClass = 'mt-1.5 text-xs font-medium text-red-700';

function Required() { return <span className="ml-1 text-[#A46232]" aria-hidden="true">*</span>; }
function FieldError({ text, id }: { text?: string; id: string }) {
  return text ? <p id={id} role="alert" className={errorClass}>{text}</p> : null;
}

export default function AffiliateApplicationForm({ slug, affiliateName }: Props) {
  const { register, handleSubmit, watch, reset, formState: { errors, isSubmitting } } = useForm<Answers>({
    mode: 'onBlur',
    reValidateMode: 'onChange',
    shouldFocusError: true,
    defaultValues: {
      position: '', years_of_experience: '', industry_field: '', assets_range: '',
      traveled_to_canada: '', visa_rejected: '', consent_to_share: false
    }
  });
  const [status, setStatus] = useState<{ kind: 'success' | 'error' | 'pending'; message: string } | null>(null);
  const rejected = watch('visa_rejected');

  async function submit(values: Answers) {
    setStatus(null);
    try {
      const base = (process.env.NEXT_PUBLIC_DJANGO_HOST_URL || 'https://back.novanestholding.com').replace(/\/+$/, '');
      const payload = {
        ...values,
        phone_number: values.phone_number.replace(/[\s()-]/g, ''),
        traveled_to_canada: values.traveled_to_canada === 'true',
        visa_rejected: values.visa_rejected === 'true',
        visa_rejection_details: values.visa_rejected === 'true' ? (values.visa_rejection_details || '').trim() : '',
        industry_field: values.industry_field.trim()
      };
      // The partner email is never supplied by the browser. The Django API resolves it
      // from its trusted, read-only JSON registry using this slug.
      const response = await fetch(`${base}/affiliate-applications/${encodeURIComponent(slug)}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        if (response.status === 429) throw new Error('Too many attempts. Please try again in an hour.');
        if (response.status === 400) throw new Error('Please check your answers and try again.');
        throw new Error('Unable to submit at the moment. Please try again later.');
      }
      reset();
      if (response.status === 202) {
        setStatus({ kind: 'pending', message: `Application #${data.reference} is saved. Email delivery is pending; do not submit again.` });
      } else {
        setStatus({ kind: 'success', message: `Thank you. Application #${data.reference} has been received and shared with NovaNest and ${affiliateName}.` });
      }
    } catch (error) {
      setStatus({ kind: 'error', message: error instanceof Error ? error.message : 'Submission failed. Please try again.' });
    }
  }

  const yesNo = (name: 'traveled_to_canada' | 'visa_rejected', legend: string) => (
    <fieldset className="min-w-0">
      <legend className={labelClass}>{legend}<Required /></legend>
      <div className="mt-3 flex flex-wrap gap-3">
        {([['true', 'Yes'], ['false', 'No']] as const).map(([value, title]) => (
          <label key={value} className="flex min-w-[108px] cursor-pointer items-center gap-2.5 rounded-xl border border-[#D7D3CB] bg-white px-4 py-3 text-sm text-[#26324B] has-[:checked]:border-primary has-[:checked]:bg-[#F8F5F0] has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-primary">
            <input type="radio" value={value} {...register(name, { required: 'Please choose Yes or No.' })} className="h-4 w-4 accent-[#AA8453]" />
            {title}
          </label>
        ))}
      </div>
      <FieldError id={`${name}-error`} text={errors[name]?.message} />
    </fieldset>
  );

  return (
    <form noValidate onSubmit={handleSubmit(submit)} aria-label="Affiliate application" className="mx-auto w-full max-w-4xl space-y-8" dir="ltr">
      <section className="overflow-hidden rounded-2xl border border-[#E7DDD1] bg-white shadow-sm">
        <div className="border-b border-[#EEE5DC] bg-[#FAF8F5] px-5 py-5 sm:px-8">
          <p className="text-xs font-bold uppercase tracking-[.16em] text-primary">01 / Personal information</p>
          <h2 className="mt-1 font-header text-xl font-semibold text-[#1D2942]">Let’s get to know you</h2>
        </div>
        <div className="grid gap-5 px-5 py-6 sm:grid-cols-2 sm:px-8">
          <div>
            <label htmlFor="aff-full-name" className={labelClass}>Full name<Required /></label>
            <input id="aff-full-name" autoComplete="name" type="text" placeholder="Your name as on your passport"
              className={fieldClass} maxLength={180} aria-invalid={!!errors.full_name} aria-describedby={errors.full_name ? 'full_name-error' : undefined}
              {...register('full_name', { required: 'Full name is required.', maxLength: 180 })} />
            <FieldError id="full_name-error" text={errors.full_name?.message} />
          </div>
          <div>
            <label htmlFor="aff-phone" className={labelClass}>Phone number (with country code)<Required /></label>
            <input id="aff-phone" autoComplete="tel" type="tel" inputMode="tel" placeholder="+1 416 555 0123"
              className={fieldClass} aria-invalid={!!errors.phone_number}
              {...register('phone_number', { required: 'Phone number is required.', validate: v => /^\+[1-9]\d{7,14}$/.test(v.replace(/[\s()-]/g, '')) || 'Start with + and country code (e.g. +14165550123).' })} />
            <FieldError id="phone_number-error" text={errors.phone_number?.message} />
          </div>
          <div>
            <label htmlFor="aff-email" className={labelClass}>Email address<Required /></label>
            <input id="aff-email" autoComplete="email" type="email" inputMode="email" placeholder="you@example.com"
              className={fieldClass} aria-invalid={!!errors.email}
              {...register('email', { required: 'Email is required.', pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Please enter a valid email.' } })} />
            <FieldError id="email-error" text={errors.email?.message} />
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-[#E7DDD1] bg-white shadow-sm">
        <div className="border-b border-[#EEE5DC] bg-[#FAF8F5] px-5 py-5 sm:px-8">
          <p className="text-xs font-bold uppercase tracking-[.16em] text-primary">02 / Background</p>
          <h2 className="mt-1 font-header text-xl font-semibold text-[#1D2942]">Professional background & education</h2>
        </div>
        <div className="grid gap-5 px-5 py-6 sm:grid-cols-2 sm:px-8">
          <div>
            <label htmlFor="aff-position" className={labelClass}>Position<Required /></label>
            <select id="aff-position" className={fieldClass} defaultValue="" aria-invalid={!!errors.position}
              aria-describedby={errors.position ? 'position-error' : undefined}
              {...register('position', { required: 'Please select your position.' })}>
              <option value="" disabled>Select a position</option>
              <option value="owner">Owner</option>
              <option value="owner_ceo">Owner &amp; CEO</option>
              <option value="ceo">CEO</option>
              <option value="senior_manager">Senior Manager</option>
              <option value="other">Other</option>
            </select>
            <FieldError id="position-error" text={errors.position?.message} />
          </div>
          <div>
            <label htmlFor="aff-years" className={labelClass}>Years of experience<Required /></label>
            <select id="aff-years" className={fieldClass} defaultValue="" aria-invalid={!!errors.years_of_experience}
              aria-describedby={errors.years_of_experience ? 'years_of_experience-error' : undefined}
              {...register('years_of_experience', { required: 'Please select your years of experience.' })}>
              <option value="" disabled>Select experience</option>
              <option value="under_5">Less than 5 years</option>
              <option value="5_10">5–10 years</option>
              <option value="10_20">10–20 years</option>
              <option value="20_plus">20+ years</option>
            </select>
            <FieldError id="years_of_experience-error" text={errors.years_of_experience?.message} />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="aff-industry" className={labelClass}>Industry / field of work<Required /></label>
            <input id="aff-industry" type="text" maxLength={180} placeholder="e.g. Tourism, Technology, Construction"
              className={fieldClass} aria-invalid={!!errors.industry_field}
              aria-describedby={errors.industry_field ? 'industry_field-error' : undefined}
              {...register('industry_field', {
                required: 'Please enter your industry or field of work.',
                validate: value => Boolean(value.trim()) || 'Please enter your industry or field of work.'
              })} />
            <FieldError id="industry_field-error" text={errors.industry_field?.message} />
          </div>
          <div>
            <label htmlFor="aff-education" className={labelClass}>Highest education degree<Required /></label>
            <select id="aff-education" className={fieldClass} defaultValue="" aria-invalid={!!errors.education_degree}
              {...register('education_degree', { required: 'Please select your education degree.' })}>
              <option value="" disabled>Select a degree</option>
              <option value="high_school">High school</option>
              <option value="bachelor">Bachelor’s degree</option>
              <option value="master">Master’s degree</option>
              <option value="phd">PhD / Doctorate</option>
            </select>
            <FieldError id="education_degree-error" text={errors.education_degree?.message} />
          </div>
          <div>
            <label htmlFor="aff-language" className={labelClass}>Language proficiency<Required /></label>
            <select id="aff-language" className={fieldClass} defaultValue="" aria-invalid={!!errors.language_level}
              {...register('language_level', { required: 'Please select your language level.' })}>
              <option value="" disabled>Select a level</option>
              <option value="none">None</option><option value="basic">Basic</option>
              <option value="intermediate">Intermediate</option><option value="advanced">Advanced</option>
            </select>
            <FieldError id="language_level-error" text={errors.language_level?.message} />
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-[#E7DDD1] bg-white shadow-sm">
        <div className="border-b border-[#EEE5DC] bg-[#FAF8F5] px-5 py-5 sm:px-8">
          <p className="text-xs font-bold uppercase tracking-[.16em] text-primary">03 / Financial & travel history</p>
          <h2 className="mt-1 font-header text-xl font-semibold text-[#1D2942]">A few final details</h2>
        </div>
        <div className="space-y-7 px-5 py-6 sm:px-8">
          <div>
            <label htmlFor="aff-assets-range" className={labelClass}>Provable assets (USD)<Required /></label>
            <p className="mt-1 text-xs text-gray-500">Select the approximate value of assets you can document. No upload is required.</p>
            <select id="aff-assets-range" className={fieldClass} defaultValue="" aria-invalid={!!errors.assets_range}
              aria-describedby={errors.assets_range ? 'assets_range-error' : undefined}
              {...register('assets_range', { required: 'Please select your provable assets range.' })}>
              <option value="" disabled>Select an asset range</option>
              <option value="under_300k">Less than US$300,000</option>
              <option value="300k_500k">US$300,000–US$500,000</option>
              <option value="500k_1m">US$500,000–US$1 million</option>
              <option value="1m_plus">US$1 million or more</option>
            </select>
            <FieldError id="assets_range-error" text={errors.assets_range?.message} />
          </div>
          {yesNo('traveled_to_canada', 'Have you traveled to Canada before?')}
          <div>
            {yesNo('visa_rejected', 'Has your Canadian visa ever been rejected?')}
            {rejected === 'true' && (
              <div className="mt-4 rounded-xl border-s-4 border-primary bg-[#FAF8F5] p-4">
                <label htmlFor="aff-visa-details" className={labelClass}>Please provide the refusal details<Required /></label>
                <textarea id="aff-visa-details" rows={3} maxLength={1800} placeholder="Approximate date, visa type, and reason if known"
                  className={`${fieldClass} resize-y`} aria-invalid={!!errors.visa_rejection_details}
                  {...register('visa_rejection_details', { validate: v => rejected !== 'true' || Boolean(v?.trim()) || 'Please provide the refusal details.' })} />
                <FieldError id="visa_rejection_details-error" text={errors.visa_rejection_details?.message} />
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-[#E7DDD1] bg-[#F8F5F0] px-5 py-6 sm:px-8">
        <h2 className="font-header text-lg font-semibold text-[#1D2942]">Privacy & consent</h2>
        <p className="mt-2 text-sm leading-6 text-gray-600">Your application includes financial and immigration-history information. It will be stored by NovaNest and shared by email with NovaNest’s application team and the designated primary contact of {affiliateName}. Please submit only information you are comfortable sharing.</p>
        <label className="mt-5 flex cursor-pointer items-start gap-3 text-sm leading-6 text-[#26324B]">
          <input type="checkbox" className="mt-1 h-5 w-5 shrink-0 accent-[#AA8453]" aria-invalid={!!errors.consent_to_share}
            {...register('consent_to_share', { required: 'Please confirm your consent before submitting.' })} />
          <span>I agree to this use and sharing of my application information. <Required /></span>
        </label>
        <FieldError id="consent_to_share-error" text={errors.consent_to_share?.message} />
        <button type="submit" disabled={isSubmitting}
          className="mt-6 inline-flex w-full items-center justify-center gap-3 rounded-xl bg-primary px-6 py-4 text-base font-semibold text-white shadow-sm transition-colors hover:bg-[#8D6B40] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary disabled:cursor-wait disabled:opacity-60 sm:w-auto sm:min-w-[260px]">
          {isSubmitting ? 'Submitting…' : 'Submit application'} <span aria-hidden="true">→</span>
        </button>
        {status && (
          <div role="status" aria-live="polite" className={`mt-5 rounded-xl px-4 py-3 text-sm ${status.kind === 'error' ? 'border border-red-300 bg-red-50 text-red-800' : 'border border-green-300 bg-green-50 text-green-900'}`}>
            {status.message}
          </div>
        )}
      </section>
    </form>
  );
}
