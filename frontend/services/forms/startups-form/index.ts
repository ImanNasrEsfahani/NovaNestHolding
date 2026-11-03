import apiClient from '@/utils/api';

/** Submit only files still active in the currently displayed Startup Validation
 * form. The owning React component clears its route-scoped file state only
 * after a confirmed Django reference, never on a failed HTTP request. */
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
