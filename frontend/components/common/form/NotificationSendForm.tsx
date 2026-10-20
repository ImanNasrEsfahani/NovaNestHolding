'use client';

import { useSubmit } from 'stores/dataStore';
import { UnifiedFormStatus } from './UnifiedFormSubmit';

interface Props {
  lang: string;
  successMessage: string;
  failedMessage: string;
}

/** Compatibility adapter for older forms that still use the legacy store. */
export default function NotificationSendForm({ successMessage, failedMessage }: Props) {
  const isSubmitting = useSubmit((state) => state.isSubmitting);
  const isSuccess = useSubmit((state) => state.isSuccess);
  const send = useSubmit((state) => state.send);
  const showNotification = useSubmit((state) => state.showNotification);

  const visible = isSubmitting && !send && showNotification;
  return (
    <div className="mx-auto w-64 lg:w-96">
      <UnifiedFormStatus
        status={visible ? (isSuccess ? 'success' : 'error') : null}
        message={isSuccess ? successMessage : failedMessage}
      />
    </div>
  );
}
