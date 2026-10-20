import apiClient from '@/utils/api';

/** Translate the About Us form's React field names to the existing Django
 * ContactUs model keys. No address supplied by the browser can control the
 * internal email recipients. Preserve failure propagation to the form UI.
 */
export async function submitContactForm(sendFormData: FormData, lang: string = 'en') {
  const firstName = String(sendFormData.get('firstName') ?? '').trim();
  const lastName = String(sendFormData.get('lastName') ?? '').trim();
  const payload = new FormData();
  payload.append('name', [firstName, lastName].filter(Boolean).join(' '));
  payload.append('email', String(sendFormData.get('email') ?? '').trim());
  payload.append('number', String(sendFormData.get('phoneNumber') ?? '').trim());
  payload.append('subject', 'Contact Us');
  payload.append('message', String(sendFormData.get('message') ?? '').trim());
  payload.append('language', lang === 'fa' ? 'fa' : 'en');

  // Axios rejects non-2xx responses. Never swallow an error here, because a
  // swallowed rejection can make the form show a false success notification.
  return apiClient.post('contactUs-form', payload, {
    headers: { 'Content-Type': 'multipart/form-data' },
    // Two sequential Microsoft Graph submissions may take longer than the
    // API client's 30-second default. Avoid misleading timeout errors.
    timeout: 150000,
  });
}
