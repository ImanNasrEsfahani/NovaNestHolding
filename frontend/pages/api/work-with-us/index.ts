import apiClient from '@/utils/api';
import type { PublicFormResponse } from '../jobs';

/** /join-us is a different form from /join-our-team: preserve its own field names. */
export async function submitWorkWithUsForm(sendFormData: FormData, csrfToken?: string) {
  const language = typeof window !== 'undefined' && window.location.pathname.startsWith('/fa/') ? 'fa' : 'en';
  sendFormData.set('language', language);
  // The old component adds a File and then a duplicate invalid cvFile value.
  // Keep the actual user-uploaded File without discarding it.
  if (typeof File !== 'undefined') {
    const cv = sendFormData.getAll('cvFile').find((value): value is File => value instanceof File);
    if (cv) sendFormData.set('cvFile', cv);
    else sendFormData.delete('cvFile');
  }
  // No date field is exposed on this form. The old shared default may produce
  // "undefined" for birthDate; do not store a fabricated date.
  const date = String(sendFormData.get('birthDate') ?? '').trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) sendFormData.delete('birthDate');
  // Do not catch/relabel errors as success.
  return apiClient.post<PublicFormResponse>('/work-with-us', sendFormData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Accept: 'application/json',
      ...(csrfToken ? { 'X-CSRFToken': csrfToken } : {}),
    },
    timeout: 150000,
  });
}
