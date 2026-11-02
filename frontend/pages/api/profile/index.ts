import apiClient from '@/utils/api';
import type { PublicFormResponse } from '../jobs';

export async function ContactProfileForm(sendFormData: FormData) {
  const language = typeof window !== 'undefined' && window.location.pathname.startsWith('/fa/') ? 'fa' : 'en';
  sendFormData.set('language', language);
  if (typeof window !== 'undefined') {
    const match = window.location.pathname.match(/^\/(?:en|fa)\/profile\/([^/?#]+)/);
    if (match) sendFormData.set('profileSlug', decodeURIComponent(match[1]));
  }
  return apiClient.post<PublicFormResponse>('/contact-profile', sendFormData, {
    headers: { 'Content-Type': 'multipart/form-data', Accept: 'application/json' },
    timeout: 150000,
  });
}
