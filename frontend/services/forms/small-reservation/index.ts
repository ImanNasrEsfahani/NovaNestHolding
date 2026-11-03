import apiClient from '@/utils/api';

export type ConsultationPayload = {
  service: 'investment' | 'acceleration' | 'entrepreneur-pnp' | 'startup';
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  language: 'en' | 'fa';
};

export type ConsultationResponse = {
  reference: number;
  notifications_sent: boolean;
  message: string;
};

/** Shared, trusted endpoint for the short consultation forms on service pages. */
export async function SubmitSmallReservationForm(payload: ConsultationPayload) {
  // Axios rejects non-2xx responses. Do not catch-and-suppress errors: the
  // caller must not display green until the API has confirmed a save.
  return apiClient.post<ConsultationResponse>('/small-reservation', payload, {
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
  });
}
