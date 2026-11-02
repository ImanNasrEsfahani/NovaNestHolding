import apiClient from '@/utils/api';
import type { PublicFormResponse } from '../jobs';

export async function submitTraineeRegistrationForm(sendFormData: FormData) {
  const language = typeof window !== 'undefined' && window.location.pathname.startsWith('/fa/') ? 'fa' : 'en';
  sendFormData.set('language', language);
  if (!sendFormData.has('birthDate') && typeof document !== 'undefined') {
    const form = document.activeElement instanceof HTMLElement ? document.activeElement.closest('form') : null;
    const date = (form?.querySelector<HTMLInputElement>('input[name="birthDate"]') ??
                  document.querySelector<HTMLInputElement>('input[name="birthDate"]'))?.value;
    if (date) sendFormData.set('birthDate', date);
  }
  return apiClient.post<PublicFormResponse>('/join-as-a-trainee', sendFormData, {
    headers: { 'Content-Type': 'multipart/form-data', Accept: 'application/json' },
    timeout: 150000,
  });
}
