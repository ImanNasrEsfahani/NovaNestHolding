
'use client';
import Check from '@/components/icons/common/Check';
import { useSubmit } from 'stores/dataStore';

interface Props {
  lang: string;
  successMessage: string;
  failedMessage: string;
}

export default function NotificationSendForm({successMessage, failedMessage }: Props) {

  const {
    isSubmitting,
    isSuccess,
    send,
    showNotification,
  } = useSubmit((s) => s)


  // const isSubmitting = useLang((s) => s.isSubmitting)
  // const isSuccess = useLang((s) => s.isSuccess)
  // const send = useLang((s) => s.send)
  // const showNotification = useLang((s) => s.showNotification)
  // const lang = useLang((s) => s.lang)

  return (
    <div className="mx-auto mt-5 w-64 lg:w-96">
      {isSuccess && isSubmitting && !send && showNotification && (
        <div className="alert alert-success">
          <Check />
          <span>{successMessage}</span>
        </div>
      )}

      {!isSuccess && isSubmitting && !send && showNotification && (
        <div className="alert alert-error">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="size-6 shrink-0 stroke-current"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{failedMessage}</span>
        </div>
      )}
    </div>
  );
}
