import apiClient from '@/utils/api';

/** Keep the newest Startup Validation page intact. Resolve attachments from
 * currently active file inputs, never from stale cross-form Zustand state.
 * The financial-model field is included automatically if the form shows it. */
export async function submitStartupsForm(sendFormData: FormData) {
  const language = typeof window !== 'undefined' && window.location.pathname.startsWith('/fa/') ? 'fa' : 'en';
  sendFormData.set('language', language);

  if (typeof document !== 'undefined') {
    const attachments = [
      'pitchDeckFile', 'businessPlanFile', 'financialFile', 'financialModelFile',
    ];
    for (const name of attachments) {
      const input = Array.from(document.querySelectorAll<HTMLInputElement>('input[type="file"]'))
        .find(candidate => candidate.name === name && !candidate.disabled &&
          !candidate.closest('[aria-hidden="true"]'));
      const file = input?.files?.[0];
      if (file instanceof File) sendFormData.set(name, file, file.name);
      else sendFormData.delete(name);
    }
  }

  return apiClient.post('startups-form', sendFormData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 150000,
  });
}
