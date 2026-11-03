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

  const { file } = syncCvFileWithVisibleInput(sendFormData);
  if (String(sendFormData.get('fieldOfExpert') ?? '').trim().toLowerCase() !== 'other') {
    sendFormData.delete('fieldOfExpertOther');
  }
  if (file) {
    // In CV mode do not submit hidden fallback fields or default birth date.
    for (const name of ['birthDate', 'educationLevel', 'educationField', 'workHistorySummary']) {
      sendFormData.delete(name);
    }
  }

  return apiClient.post<PublicFormResponse>('/join-our-team', sendFormData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Accept: 'application/json',
      ...(csrfToken ? { 'X-CSRFToken': csrfToken } : {}),
    },
    timeout: 150000,
  });
}
