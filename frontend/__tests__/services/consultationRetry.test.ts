import { TextEncoder } from 'util';
import apiClient from '@/utils/api';
import { SubmitSmallReservationForm, type ConsultationPayload } from '@/services/forms/small-reservation';

jest.mock('@/utils/api', () => ({ __esModule: true, default: { post: jest.fn() } }));

const post = apiClient.post as jest.Mock;
const payload: ConsultationPayload = {
  service: 'investment', first_name: 'Nadia', last_name: 'Rostami',
  email: 'nadia@example.com', phone_number: '+17785550124', language: 'en',
};

let counter = 0;
beforeEach(() => {
  post.mockReset();
  window.sessionStorage.clear();
  Object.defineProperty(globalThis, 'TextEncoder', { configurable: true, value: TextEncoder });
  // jsdom may not provide the Web Crypto SubtleCrypto interface. Keep tests
  // deterministic: the same input has the same fingerprint, with no PII saved.
  Object.defineProperty(globalThis, 'crypto', { configurable: true, value: {
    randomUUID: () => `00000000-0000-4000-8000-${String(++counter).padStart(12, '0')}`,
    subtle: { digest: async (_algorithm: string, data: Uint8Array) => {
      const output = new Uint8Array(32);
      data.forEach((byte, i) => { output[i % 32] = (output[i % 32] + byte) % 256; });
      return output.buffer;
    } },
  } });
});

describe('public consultation request retries', () => {
  it('reuses the idempotency key after an ambiguous network error', async () => {
    const entry = { ...payload, email: `retry-${counter}@example.org` };
    post.mockRejectedValueOnce(new Error('timeout'))
      .mockResolvedValueOnce({ status: 201, data: { reference: 88, notifications_sent: true } });
    await expect(SubmitSmallReservationForm(entry)).rejects.toThrow('timeout');
    await expect(SubmitSmallReservationForm(entry)).resolves.toMatchObject({ status: 201 });
    const first = post.mock.calls[0][1].idempotency_key;
    const second = post.mock.calls[1][1].idempotency_key;
    expect(first).toBe(second);
    expect(post.mock.calls[0][2].timeout).toBe(150000);
    expect(first).toMatch(/^[0-9a-f-]{36}$/);
  });

  it('allows a new intentional request after a confirmed save', async () => {
    const entry = { ...payload, email: `new-${counter}@example.org` };
    post.mockResolvedValue({ status: 201, data: { reference: 1, notifications_sent: true } });
    await SubmitSmallReservationForm(entry);
    await SubmitSmallReservationForm(entry);
    expect(post.mock.calls[0][1].idempotency_key)
      .not.toBe(post.mock.calls[1][1].idempotency_key);
  });

  it('does not release the key on a malformed success response', async () => {
    const entry = { ...payload, email: `bad-${counter}@example.org` };
    post.mockResolvedValueOnce({ status: 200, data: {} })
      .mockResolvedValueOnce({ status: 202, data: { reference: 4, notifications_sent: false } });
    await expect(SubmitSmallReservationForm(entry)).rejects.toThrow('confirm');
    await SubmitSmallReservationForm(entry);
    expect(post.mock.calls[0][1].idempotency_key)
      .toBe(post.mock.calls[1][1].idempotency_key);
  });
});
