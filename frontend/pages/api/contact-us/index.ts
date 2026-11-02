import apiClient from '@/utils/api';

/** Preserve independently submitted first/last names as well as the legacy
 * combined name used by existing Django records and email notifications. */
export async function submitContactForm(sendFormData: FormData, lang: string = 'en') {
  const firstName = String(sendFormData.get('firstName') ?? '').trim();
  const lastName = String(sendFormData.get('lastName') ?? '').trim();
  const payload = new FormData();
  payload.append('firstName', firstName);
  payload.append('lastName', lastName);
  payload.append('name', [firstName, lastName].filter(Boolean).join(' '));
  payload.append('email', String(sendFormData.get('email') ?? '').trim());
  payload.append('number', String(sendFormData.get('phoneNumber') ?? '').trim());
  payload.append('subject', 'Contact Us');
  payload.append('message', String(sendFormData.get('message') ?? '').trim());
  payload.append('language', lang === 'fa' ? 'fa' : 'en');
  // Keep the existing 150s timeout and never swallow rejected HTTP responses.
  return apiClient.post('contactUs-form', payload, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 150000,
  });
}
