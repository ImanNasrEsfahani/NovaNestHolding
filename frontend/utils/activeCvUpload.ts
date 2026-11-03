/**
 * Only a file the visitor currently selected in an enabled, visible input may
 * be submitted. The older forms share a Zustand CV slot; reading that slot
 * alone can accidentally submit a file from an earlier page or a disabled mode.
 *
 * This helper is only used by client-side submit functions, not during SSR.
 */
function currentCvInput(): HTMLInputElement | null {
  if (typeof document === 'undefined') return null;
  const activeForm = document.activeElement instanceof Element
    ? document.activeElement.closest('form')
    : null;
  return activeForm?.querySelector<HTMLInputElement>('input[type="file"][name="cvFile"]')
    ?? document.querySelector<HTMLInputElement>('input[type="file"][name="cvFile"]');
}

export function syncCvFileWithVisibleInput(payload: FormData): {
  enabled: boolean;
  file: File | null;
} {
  if (typeof document === 'undefined') {
    // No browser: do not make assumptions about which input is active.
    return { enabled: false, file: null };
  }
  const input = currentCvInput();
  const enabled = !!input && !input.disabled && !input.closest('[aria-hidden="true"]');
  const file = enabled ? input?.files?.[0] ?? null : null;

  if (file instanceof File) payload.set('cvFile', file, file.name);
  else payload.delete('cvFile');

  return { enabled, file: file instanceof File ? file : null };
}

export function clearVisibleCvInput(): void {
  const input = currentCvInput();
  if (input) input.value = '';
}
