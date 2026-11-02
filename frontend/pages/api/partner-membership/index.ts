import apiClient from '@/utils/api';

/** Public Affiliate Registration, NOT a partner-specific application form. */
export type PartnerMembershipResponse = {
  reference: number;
  notifications_sent: boolean;
  message: string;
};

export async function submitPartnerMembershipForm(sendFormData: FormData) {
  // The Django URL is /partner-membership. The former endpoint
  // /affiliate-registration-form does not exist in backend/forms/urls.py.
  // Never swallow an HTTP/network error: the form must retain entered values.
  // Two sequential Microsoft Graph notifications can exceed the API default.
  return apiClient.post<PartnerMembershipResponse>('/partner-membership', sendFormData, {
    headers: { 'Content-Type': 'multipart/form-data', Accept: 'application/json' },
    timeout: 150000,
  });
}
