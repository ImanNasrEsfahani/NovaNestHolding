import apiClient from '@/utils/api';
import type { PublicFormResponse } from '../jobs';
import { syncCvFileWithVisibleInput } from '@/utils/activeCvUpload';

export async function submitTraineeRegistrationForm(sendFormData: FormData) {
  const language = typeof window !== 'undefined' && window.location.pathname.startsWith('/fa/') ? 'fa' : 'en';
  sendFormData.set('language', language);

  // The current visible input takes precedence over any earlier CV in store.
  const { file } = syncCvFileWithVisibleInput(sendFormData);
  // FieldOfExpertOther is only applicable to the visible Other selection.
  if (String(sendFormData.get('fieldOfExpert') ?? '').trim().toLowerCase() !== 'other') {
    sendFormData.delete('fieldOfExpertOther');
  }
  if (file) {
    // Hidden alternative details must not persist, including default "today".
    sendFormData.delete('birthDate');
    sendFormData.delete('tellUsAboutYourself');
  } else if (!sendFormData.has('birthDate') && typeof document !== 'undefined') {
    const form = document.activeElement instanceof HTMLElement ? document.activeElement.closest('form') : null;
    const input = form?.querySelector<HTMLInputElement>('input[name="birthDate"]');
    if (input && !input.disabled && !input.closest('[aria-hidden="true"]') && input.value) {
      sendFormData.set('birthDate', input.value);
    }
  }
  return apiClient.post<PublicFormResponse>('/join-as-a-trainee', sendFormData, {
    headers: { 'Content-Type': 'multipart/form-data', Accept: 'application/json' },
    timeout: 150000,
  });
}
