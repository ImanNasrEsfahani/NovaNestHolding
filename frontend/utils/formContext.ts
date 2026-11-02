/** Marketing and locale context, not personal data or a source of email recipients. */
export function submissionContextHeader(): string | undefined {
  if (typeof window === 'undefined') return undefined;
  try {
    const url = new URL(window.location.href);
    const parts = new URLSearchParams(url.search);
    const referrer = document.referrer ? new URL(document.referrer).hostname : '';
    const context: Record<string, string> = {
      source_path: url.pathname,
      referrer_host: referrer,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || '',
    };
    for (const key of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term']) {
      context[key] = (parts.get(key) || '').slice(0, 160);
    }
    // HTTP header values must be ByteStrings (ASCII here); escape non-ASCII
    // UTM values instead of causing fetch/Axios to reject Persian text.
    return JSON.stringify(context).replace(/[\u007f-\uffff]/g, ch =>
      `\\u${ch.charCodeAt(0).toString(16).padStart(4, '0')}`);
  } catch {
    return undefined;
  }
}
