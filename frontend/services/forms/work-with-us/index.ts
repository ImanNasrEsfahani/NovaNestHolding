import apiClient from '@/utils/api';
import type { PublicFormResponse } from '../jobs';
import { clearVisibleCvInput, syncCvFileWithVisibleInput } from '@/utils/activeCvUpload';

/** /join-us is a different form from /join-our-team: preserve its own field names. */
export async function submitWorkWithUsForm(sendFormData: FormData, csrfToken?: string) {
  const language = typeof window !== 'undefined' && window.location.pathname.startsWith('/fa/') ? 'fa' : 'en';
  sendFormData.set('language', language);

  // Use only the actual file chosen in the currently visible Work With Us form.
  // The old shared Zustand slot may still contain a CV from another page.
  const { file } = syncCvFileWithVisibleInput(sendFormData);
  const position = String(sendFormData.get('your_position') ?? '').trim();
  // Also guard the translated Professor option if native validation is bypassed.
  if ((position === 'Professor' || position === 'استاد دانشگاه') && !file &&
      typeof document !== 'undefined') {
    throw new Error(language === 'fa' ? 'لطفاً فایل رزومه را انتخاب کنید.' : 'Please select a CV file.');
  }

  // No birth-date input exists on this page. Ignore old shared form defaults.
  const date = String(sendFormData.get('birthDate') ?? '').trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) sendFormData.delete('birthDate');

  const response = await apiClient.post<PublicFormResponse>('/work-with-us', sendFormData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Accept: 'application/json',
      ...(csrfToken ? { 'X-CSRFToken': csrfToken } : {}),
    },
    timeout: 150000,
  });
  const reference = response.data?.reference;
  if ((response.status === 201 || response.status === 202) &&
      Number.isInteger(reference) && reference > 0) {
    // The form is reset by its React component; reset the raw file input too.
    clearVisibleCvInput();
  }
  return response;
}
