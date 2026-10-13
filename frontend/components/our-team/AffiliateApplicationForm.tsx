'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';

type Answers = {
  full_name: string;
  phone_number: string;
  email: string;
  age: number;
  country: string;
  city: string;
  work_experience: string;
  education_degree: string;
  language_level: string;
  ielts_score: number | null;
  assets_amount: string;
  assets_currency: string;
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
    defaultValues: { assets_currency: 'CAD', traveled_to_canada: '', visa_rejected: '', ielts_score: null, consent_to_share: false }
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
        ielts_score: values.ielts_score != null && Number.isFinite(values.ielts_score) ? values.ielts_score : null
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
          <div>
            <label htmlFor="aff-age" className={labelClass}>Age<Required /></label>
            <input id="aff-age" type="number" min={1} max={120} step={1} inputMode="numeric" placeholder="e.g. 35"
              className={fieldClass} aria-invalid={!!errors.age}
              {...register('age', { valueAsNumber: true, required: 'Age is required.', min: { value: 1, message: 'Please enter a valid age.' }, max: { value: 120, message: 'Please enter a valid age.' } })} />
            <FieldError id="age-error" text={errors.age?.message} />
          </div>
          <fieldset className="sm:col-span-2">
            <legend className={labelClass}>Country and city of residence<Required /></legend>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="sr-only" htmlFor="aff-country">Country of residence</label>
                <input id="aff-country" type="text" autoComplete="country-name" placeholder="Country" maxLength={100}
                  className={fieldClass} aria-invalid={!!errors.country}
                  {...register('country', { required: 'Country is required.' })} />
                <FieldError id="country-error" text={errors.country?.message} />
              </div>
              <div>
                <label className="sr-only" htmlFor="aff-city">City of residence</label>
                <input id="aff-city" type="text" autoComplete="address-level2" placeholder="City" maxLength={100}
                  className={fieldClass} aria-invalid={!!errors.city}
                  {...register('city', { required: 'City is required.' })} />
                <FieldError id="city-error" text={errors.city?.message} />
              </div>
            </div>
          </fieldset>
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-[#E7DDD1] bg-white shadow-sm">
        <div className="border-b border-[#EEE5DC] bg-[#FAF8F5] px-5 py-5 sm:px-8">
          <p className="text-xs font-bold uppercase tracking-[.16em] text-primary">02 / Background</p>
          <h2 className="mt-1 font-header text-xl font-semibold text-[#1D2942]">Experience & education</h2>
        </div>
        <div className="grid gap-5 px-5 py-6 sm:grid-cols-2 sm:px-8">
          <div className="sm:col-span-2">
            <label htmlFor="aff-experience" className={labelClass}>Work experience in the last 5 years<Required /></label>
            <p className="mt-1 text-xs text-gray-500">Describe your roles, employers, and approximate dates.</p>
            <textarea id="aff-experience" rows={4} placeholder="Example: 2022–2026, software engineer at…" maxLength={2400}
              className={`${fieldClass} resize-y`} aria-invalid={!!errors.work_experience}
              {...register('work_experience', { required: 'Please tell us about your experience.', minLength: { value: 10, message: 'Please add a little more detail.' } })} />
            <FieldError id="work_experience-error" text={errors.work_experience?.message} />
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
            <label htmlFor="aff-ielts" className="mt-4 block text-sm font-medium text-[#26324B]">IELTS overall score <span className="font-normal text-gray-500">(optional)</span></label>
            <input id="aff-ielts" type="number" min={0} max={9} step={0.5} inputMode="decimal" placeholder="e.g. 7.0"
              className={fieldClass} aria-invalid={!!errors.ielts_score}
              {...register('ielts_score', { setValueAs: v => v === '' ? null : Number(v), validate: v => v === null || v === undefined || (Number.isFinite(v) && v >= 0 && v <= 9 && v * 2 % 1 === 0) || 'Enter a score from 0 to 9 in 0.5 steps.' })} />
            <FieldError id="ielts_score-error" text={errors.ielts_score?.message} />
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-[#E7DDD1] bg-white shadow-sm">
        <div className="border-b border-[#EEE5DC] bg-[#FAF8F5] px-5 py-5 sm:px-8">
          <p className="text-xs font-bold uppercase tracking-[.16em] text-primary">03 / Financial & travel history</p>
          <h2 className="mt-1 font-header text-xl font-semibold text-[#1D2942]">A few final details</h2>
        </div>
        <div className="space-y-7 px-5 py-6 sm:px-8">
          <fieldset>
            <legend className={labelClass}>Provable assets<Required /></legend>
            <p className="mt-1 text-xs text-gray-500">Your approximate documented assets (not an upload).</p>
            <div className="grid gap-3 sm:grid-cols-[1fr_170px]">
              <div>
                <label className="sr-only" htmlFor="aff-assets">Amount</label>
                <input id="aff-assets" type="number" min="0" step="0.01" inputMode="decimal" placeholder="Amount"
                  className={fieldClass} aria-invalid={!!errors.assets_amount}
                  {...register('assets_amount', { required: 'Please enter an amount.', validate: v => Number.isFinite(Number(v)) && Number(v) >= 0 || 'Enter a valid amount.' })} />
                <FieldError id="assets_amount-error" text={errors.assets_amount?.message} />
              </div>
              <div>
                <label className="sr-only" htmlFor="aff-currency">Currency</label>
                <select id="aff-currency" className={fieldClass} {...register('assets_currency', { required: true })}>
                  {['CAD','USD','EUR','GBP','IRR','AED','AUD','INR','TRY','OTHER'].map(v => <option key={v} value={v}>{v}</option>)}
                </select>
              </div>
            </div>
          </fieldset>
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
