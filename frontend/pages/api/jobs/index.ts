import apiClient from '@/utils/api';
import { syncCvFileWithVisibleInput } from '@/utils/activeCvUpload';

export type PublicFormResponse = {
  reference: number;
  notifications_sent: boolean;
  message: string;
};

export async function submitJoinOurTeamForm(sendFormData: FormData, csrfToken?: string) {
  const language = typeof window !== 'undefined' && window.location.pathname.startsWith('/fa/') ? 'fa' : 'en';
  sendFormData.set('language', language);

  // A disabled CV input means the applicant switched to the non-CV route.
  // Trust the current input, not a previously selected file in shared Zustand.
  syncCvFileWithVisibleInput(sendFormData);

  return apiClient.post<PublicFormResponse>('/join-our-team', sendFormData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Accept: 'application/json',
      ...(csrfToken ? { 'X-CSRFToken': csrfToken } : {}),
    },
    timeout: 150000,
  });
}
