import apiClient from '@/utils/api';

export type PublicFormResponse = {
  reference: number;
  notifications_sent: boolean;
  message: string;
};

export async function submitJoinOurTeamForm(sendFormData: FormData, csrfToken?: string) {
  const language = typeof window !== 'undefined' && window.location.pathname.startsWith('/fa/') ? 'fa' : 'en';
  sendFormData.set('language', language);
  // The Django endpoint now exists; the server chooses all mail recipients.
  return apiClient.post<PublicFormResponse>('/join-our-team', sendFormData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Accept: 'application/json',
      ...(csrfToken ? { 'X-CSRFToken': csrfToken } : {}),
    },
    timeout: 150000,
  });
}
