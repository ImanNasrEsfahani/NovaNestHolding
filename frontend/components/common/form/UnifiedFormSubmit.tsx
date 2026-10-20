'use client';

import type { ReactNode } from 'react';

export type SubmissionLanguage = 'fa' | 'en';
export type SubmissionStatus = 'success' | 'error' | 'pending';

type SubmitButtonProps = {
  lang?: SubmissionLanguage;
  label?: string;
  loadingLabel?: string;
  busy?: boolean;
  disabled?: boolean;
  variant?: 'solid' | 'outline';
  background?: 'black' | 'primary' | 'secondary' | 'white' | 'transparent';
  className?: string;
  trailing?: ReactNode;
};

const copy = {
  en: { send: 'Send', sending: 'Sending…' },
  fa: { send: 'ارسال', sending: 'در حال ارسال…' },
};

const solidBackground = {
  black: 'bg-black text-white hover:bg-primary',
  primary: 'bg-primary text-white hover:opacity-90',
  secondary: 'bg-secondary text-white hover:opacity-90',
  white: 'bg-white text-gray-900 hover:bg-gray-50',
  transparent: 'bg-transparent text-gray-900 hover:bg-gray-50',
};

/** Presentation only. The caller owns validation, asynchronous work and results. */
export function UnifiedFormSubmit({
  lang = 'en', label, loadingLabel, busy = false, disabled = false,
  variant = 'solid', background = 'black', className = '', trailing,
}: SubmitButtonProps) {
  const words = copy[lang];
  const style = variant === 'outline'
    ? 'rounded-lg border border-[#D7D3CB] bg-white text-[#26324B] hover:bg-[#FAF8F5]'
    : `rounded-xl ${solidBackground[background]}`;

  return (
    <button
      type="submit"
      disabled={disabled || busy}
      aria-busy={busy}
      className={`inline-flex min-h-[50px] items-center justify-center gap-2 px-6 py-3 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-wait disabled:opacity-60 disabled:hover:opacity-60 ${style} ${className}`}
    >
      {busy && (
        <svg aria-hidden="true" className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-30" cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="3" />
          <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        </svg>
      )}
      <span>{busy ? (loadingLabel || words.sending) : (label || words.send)}</span>
      {!busy && trailing}
    </button>
  );
}

type SubmitStatusProps = {
  status: SubmissionStatus | null;
  message?: string | null;
  className?: string;
};

/** A result is shown only after the caller has confirmed an API outcome. */
export function UnifiedFormStatus({ status, message, className = '' }: SubmitStatusProps) {
  if (!status || !message) return null;
  const colors = {
    success: 'border-green-300 bg-green-50 text-green-900',
    pending: 'border-amber-300 bg-amber-50 text-amber-900',
    error: 'border-red-300 bg-red-50 text-red-800',
  };
  return (
    <div role={status === 'error' ? 'alert' : 'status'} aria-live="polite"
      className={`mt-5 rounded-xl border px-4 py-3 text-sm ${colors[status]} ${className}`}>
      {message}
    </div>
  );
}
