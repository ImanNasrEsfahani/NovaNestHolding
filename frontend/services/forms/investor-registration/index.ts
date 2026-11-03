import apiClient from '@/utils/api';

export type InvestorRegistrationResponse = {
  reference: number;
  notifications_sent: boolean;
  message: string;
};

/** The public Investor Registration form, not an affiliate application. */
export async function submitInvestorRegistrationForm(sendFormData: FormData) {
  const language = typeof window !== 'undefined' && window.location.pathname.startsWith('/fa/') ? 'fa' : 'en';
  sendFormData.set('language', language);
  // Never swallow 4xx, 5xx, or network failures: the caller must display an error.
  return apiClient.post<InvestorRegistrationResponse>('/investor-registration', sendFormData, {
    headers: { 'Content-Type': 'multipart/form-data', Accept: 'application/json' },
    timeout: 150000,
  });
}
