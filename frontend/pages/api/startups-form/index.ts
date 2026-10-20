import apiClient from '@/utils/api';

/** A single transport for the EN/FA Startup Validation forms. */
export async function submitStartupsForm(sendFormData: FormData) {
  // Do not trust a user-editable email address for the admin recipient.
  // The backend uses its own fixed NovaNest recipient address.
  const language = typeof window !== 'undefined' && window.location.pathname.startsWith('/fa/') ? 'fa' : 'en';
  sendFormData.set('language', language);
  // Axios rejects non-2xx responses. Propagate the error; never pretend an
  // unsuccessful request was saved and never clear the original form on failure.
  return apiClient.post('startups-form', sendFormData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
}
