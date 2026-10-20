'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import type { ContactFormDataType } from '@/types/global';
import { initialContactFormData } from '../../../initials/initObjects';
import { submitContactForm } from '../../../pages/api/contact-us';
import PersonalInfoInput from '@/components/common/form/PersonalInfoInput';
import TextArea from '@/components/common/TextArea';
import FormTitle from './FormTitle';
import { UnifiedFormSubmit, UnifiedFormStatus, type SubmissionStatus } from './UnifiedFormSubmit';

type Translations = React.ComponentProps<typeof PersonalInfoInput>['translations'] & {
  title: string;
  subTitle: string;
  message: string;
  messageRequired: string;
  messagePlaceholder: string;
  messagePlaceholderErrorMessage: string;
  sendingButton: string;
  sendButton: string;
  successMessage: string;
  failedMessage: string;
};

type Props = { lang: string; translations: Translations };
type SubmissionResult = { status: SubmissionStatus; message: string } | null;

/** The About Us Contact form. API success/error and button state are LOCAL
 * to this form; another form's Zustand flags can never change its message.
 */
export default function ContactUsFormClient({ lang, translations }: Props) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormDataType>({
    mode: 'onBlur',
    reValidateMode: 'onChange',
    defaultValues: initialContactFormData,
  });
  const [result, setResult] = useState<SubmissionResult>(null);
  const language = lang === 'fa' ? 'fa' : 'en';

  async function onSubmit(form: ContactFormDataType) {
    setResult(null);
    try {
      const data = new FormData();
      for (const [key, value] of Object.entries(form)) {
        data.append(key, String(value ?? ''));
      }
      // The API adapter converts firstName/lastName/phoneNumber into the
      // unchanged Django model field names and passes the form locale.
      const response = await submitContactForm(data, language);
      if (!response || (response.status !== 201 && response.status !== 202)) {
        throw new Error('Unexpected Contact Us API response');
      }
      const reference = response.data?.reference;
      reset(initialContactFormData);
      if (response.status === 202 || response.data?.notifications_sent === false) {
        setResult({
          status: 'pending',
          message: language === 'fa'
            ? `پیام شما${reference ? ` با شماره پیگیری ${reference}` : ''} ثبت شد، اما ارسال یک یا چند ایمیل در انتظار بررسی است. لطفاً دوباره ثبت نکنید.`
            : `Your message${reference ? ` (reference #${reference})` : ''} was saved, but email notifications are pending. Please do not submit again.`,
        });
      } else {
        setResult({
          status: 'success',
          message: `${translations.successMessage}${reference ? ` (#${reference})` : ''}`,
        });
      }
    } catch {
      // Do not reset the user's inputs after a rejected/network-failed request.
      setResult({ status: 'error', message: translations.failedMessage });
    }
  }

  return (
    <div className="flex h-full flex-col items-center justify-between md:items-start">
      <div className="h-[75px] w-full md:h-[125px]">
        <FormTitle formTitle={translations.title} formSubtitle={translations.subTitle} />
      </div>
      <form onSubmit={handleSubmit(onSubmit, () => setResult(null))} className="w-full pt-6" noValidate>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <PersonalInfoInput
            register={register}
            errors={errors}
            nameInputs={{
              firstName: 'firstName',
              lastName: 'lastName',
              email: 'email',
              phoneNumber: 'phoneNumber',
              countryOfResidence: '',
              provinceOfResidence: '',
              cityOfResidence: '',
              TypeOfCollaboration: '',
              FieldOfExpert: '',
              FieldOfInterest: '',
            }}
            noLabel={false}
            translations={translations}
          />
        </div>
        <TextArea
          title={translations.message}
          register={register}
          errors={errors}
          required={translations.messageRequired}
          nameTextArea="message"
          patternValue=""
          patternMessage=""
          placeholder={translations.messagePlaceholder}
          rows={4}
          cols={20}
          maxLength={1450}
          maxLengthMessage={translations.messagePlaceholderErrorMessage}
          validate=""
        />
        <div className="mx-auto mt-20 flex justify-center pb-4">
          <UnifiedFormSubmit
            lang={language}
            label={translations.sendButton}
            loadingLabel={translations.sendingButton}
            busy={isSubmitting}
            className="w-44 md:w-52"
          />
        </div>
      </form>
      <div className="mx-auto w-64 lg:w-96">
        <UnifiedFormStatus status={result?.status ?? null} message={result?.message} />
      </div>
    </div>
  );
}
