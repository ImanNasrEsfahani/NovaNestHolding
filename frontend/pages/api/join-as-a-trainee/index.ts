import apiClient from '@/utils/api';
import type { PublicFormResponse } from '../jobs';
import { syncCvFileWithVisibleInput } from '@/utils/activeCvUpload';

export async function submitTraineeRegistrationForm(sendFormData: FormData) {
  const language = typeof window !== 'undefined' && window.location.pathname.startsWith('/fa/') ? 'fa' : 'en';
  sendFormData.set('language', language);

  // Replace any stale shared-store CV with the file actually selected now.
  // In the "No CV" mode the input is disabled, so the upload is discarded.
  syncCvFileWithVisibleInput(sendFormData);

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
