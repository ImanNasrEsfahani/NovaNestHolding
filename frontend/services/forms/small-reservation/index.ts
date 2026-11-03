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
  already_processed?: boolean;
};

// A timeout can occur *after* Django saved the consultation. Keep the same
// UUID for retries of the same data, including after a browser refresh. No
// personal information is persisted: sessionStorage holds only a SHA-256
// fingerprint, a random UUID and the time of the attempt.
const STORAGE_PREFIX = 'novanest:consultation:retry:v1:';
const RETRY_TTL_MS = 24 * 60 * 60 * 1000;
const memoryKeys = new Map<string, { key: string; created: number }>();

type PendingKey = { key: string; created: number };

async function payloadFingerprint(payload: ConsultationPayload): Promise<string> {
  const bytes = new TextEncoder().encode(JSON.stringify(payload));
  if (!globalThis.crypto?.subtle) {
    // Secure-context browsers should always have subtle. Without it, we can
    // still protect consecutive retries in memory, but do not persist PII.
    return `memory:${JSON.stringify(payload)}`;
  }
  const hash = await globalThis.crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(hash), b => b.toString(16).padStart(2, '0')).join('');
}

function storageFor(fingerprint: string): string | null {
  return fingerprint.startsWith('memory:') ? null : STORAGE_PREFIX + fingerprint;
}

function retryKey(fingerprint: string): string {
  const storageKey = storageFor(fingerprint);
  const now = Date.now();
  let existing = memoryKeys.get(fingerprint);
  if (!existing && storageKey && typeof window !== 'undefined') {
    try {
      const candidate = JSON.parse(window.sessionStorage.getItem(storageKey) || 'null') as PendingKey | null;
      if (candidate && typeof candidate.key === 'string' &&
          typeof candidate.created === 'number') existing = candidate;
    } catch { /* sessionStorage may be unavailable in private browsing */ }
  }
  if (!existing || now - existing.created > RETRY_TTL_MS ||
      now < existing.created || !/^[0-9a-f-]{36}$/i.test(existing.key)) {
    if (!globalThis.crypto?.randomUUID) {
      throw new Error('A secure browser context is required to submit the consultation form.');
    }
    existing = { key: globalThis.crypto.randomUUID(), created: now };
  }
  memoryKeys.set(fingerprint, existing);
  if (storageKey && typeof window !== 'undefined') {
    try { window.sessionStorage.setItem(storageKey, JSON.stringify(existing)); }
    catch { /* In-memory protection remains available */ }
  }
  return existing.key;
}

function releaseKey(fingerprint: string) {
  memoryKeys.delete(fingerprint);
  const storageKey = storageFor(fingerprint);
  if (storageKey && typeof window !== 'undefined') {
    try { window.sessionStorage.removeItem(storageKey); } catch { /* ignore */ }
  }
}

/** Retains the existing API URL and adds safe retries after ambiguous timeouts.
 * A confirmed response clears the key, permitting an intentional new enquiry.
 */
export async function SubmitSmallReservationForm(payload: ConsultationPayload) {
  const fingerprint = await payloadFingerprint(payload);
  const idempotencyKey = retryKey(fingerprint);
  const response = await apiClient.post<ConsultationResponse>('/small-reservation', {
    ...payload,
    idempotency_key: idempotencyKey,
  }, {
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    timeout: 150000,
  });
  if ((response.status !== 201 && response.status !== 202) ||
      !Number.isInteger(response.data?.reference) || response.data.reference <= 0) {
    throw new Error('Server did not confirm a saved consultation reference.');
  }
  releaseKey(fingerprint);
  return response;
}
