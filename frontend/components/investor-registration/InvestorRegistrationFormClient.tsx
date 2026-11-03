'use client';

import { useState, type ComponentProps } from 'react';
import { useForm } from 'react-hook-form';
import type { InvestorRegistrationFormDataType } from '@/types/global';
import TextArea from '@/components/common/TextArea';
import { initialInvestorRegistrationFormData } from '../../initials/initObjects';
import { submitInvestorRegistrationForm } from '@/services/forms/investor-registration';
import PersonalInfoInput from '@/components/common/form/PersonalInfoInput';
import FormTitle from '@/components/common/form/FormTitle';
import Input from '@/components/common/form/Input';
import {
  UnifiedFormSubmit,
  UnifiedFormStatus,
  type SubmissionStatus,
} from '@/components/common/form/UnifiedFormSubmit';

type Translations = ComponentProps<typeof PersonalInfoInput>['translations'] & {
  formTitle: string;
  formSubtitle: string;
  maximumInvestment: string;
  maximumInvestmentPlaceholder: string;
  preferredAreas: string;
  preferredAreasPlaceholder: string;
  preferredAreasRequired: string;
  preferredAreasErrorMessage: string;
  howDidYouKnowUs: string;
  howDidYouKnowUsPlaceholder: string;
  howDidYouKnowUsErrorMessage: string;
  sendButton: string;
  sendingButton: string;
  successMessage: string;
  failedMessage: string;
};

type Props = { lang: string; translations: Translations };
type Result = { status: SubmissionStatus; message: string } | null;

/**
 * Public Investor Registration only. Keep the user's form fields on all
 * failures; reset solely after the server returns a valid saved reference.
 */
export default function InvestorRegistrationFormClient({ lang, translations }: Props) {
  const language: 'fa' | 'en' = lang === 'fa' ? 'fa' : 'en';
  const { register, handleSubmit, reset, setError, formState: { errors, isSubmitting } } =
    useForm<InvestorRegistrationFormDataType>({
      mode: 'onBlur',
      reValidateMode: 'onChange',
      defaultValues: initialInvestorRegistrationFormData,
    });
  const [result, setResult] = useState<Result>(null);
  const [formVersion, setFormVersion] = useState(0);

  const submit = async (values: InvestorRegistrationFormDataType) => {
    setResult(null);
    const payload = new FormData();
    for (const [key, value] of Object.entries(values)) {
      if (value !== null && value !== undefined && typeof value !== 'object') {
        payload.append(key, String(value));
      }
    }
    payload.append('language', language);

    try {
      const response = await submitInvestorRegistrationForm(payload);
      const reference = response.data?.reference;
      // A 2xx alone is not sufficient proof that the database saved the form.
      if ((response.status !== 201 && response.status !== 202) ||
          !Number.isInteger(reference) || reference <= 0) {
        throw new Error('Missing saved registration reference');
      }

      // Only a confirmed database write can clear the user's entered values.
      reset(initialInvestorRegistrationFormData);
      setFormVersion(version => version + 1); // Also resets CountryInput internal UI state.
      if (response.status === 202 || response.data.notifications_sent !== true) {
        setResult({
          status: 'pending',
          message: language === 'fa'
            ? `درخواست ثبت‌نام سرمایه‌گذار شما با شماره پیگیری #${reference} ذخیره شد، اما ارسال بعضی ایمیل‌ها در انتظار بررسی است. لطفاً دوباره ثبت نکنید.`
            : `Your investor registration was saved (reference #${reference}), but some email notifications are pending. Please do not submit again.`,
        });
      } else {
        setResult({
          status: 'success',
          message: `${translations.successMessage} (#${reference})`,
        });
      }
    } catch (error) {
      // Surface any field-level server validation failures without clearing form.
      const api = error as {
        response?: { status?: number; data?: Record<string, unknown> };
      };
      if (api.response?.status === 400 && api.response.data) {
        const fieldNames: Array<keyof InvestorRegistrationFormDataType> = [
          'firstName', 'lastName', 'email', 'phoneNumber', 'countryOfResidence',
          'investmentCeiling', 'preferredAreas', 'howDidYouKnowUs',
        ];
        for (const field of fieldNames) {
          const fieldError = api.response.data[field];
          if (fieldError) {
            setError(field, {
              type: 'server',
              message: Array.isArray(fieldError) ? String(fieldError[0]) : String(fieldError),
            });
          }
        }
      }
      setResult({
        status: 'error',
        message: language === 'fa'
          ? `${translations.failedMessage} اطلاعات واردشده حفظ شده است. اگر وضعیت ارسال نامشخص است، پیش از ثبت مجدد با ما تماس بگیرید.`
          : `${translations.failedMessage} Your entries have been kept. If the request may have reached the server, contact us before submitting again.`,
      });
    }
  };

  return (
    <div className="max-w-responsive mx-auto pt-12 pb-20" dir={language === 'fa' ? 'rtl' : 'ltr'}>
      <div className="h-[75px] md:h-[125px]">
        <FormTitle formTitle={translations.formTitle} formSubtitle={translations.formSubtitle} />
      </div>
      <form onSubmit={handleSubmit(submit, () => setResult(null))} className="w-full" noValidate>
        <div className="grid grid-cols-1 gap-6 mt-9 md:grid-cols-2 xl:grid-cols-3">
          <PersonalInfoInput
            key={formVersion}
            register={register}
            errors={errors}
            nameInputs={{
              firstName: 'firstName',
              lastName: 'lastName',
              email: 'email',
              phoneNumber: 'phoneNumber',
              countryOfResidence: 'countryOfResidence',
              provinceOfResidence: '',
              cityOfResidence: '',
              TypeOfCollaboration: '',
              FieldOfExpert: '',
              FieldOfInterest: '',
            }}
            noLabel={false}
            translations={translations}
          />
          <Input
            id="investmentCeiling" register={register} errors={errors}
            nameInput="investmentCeiling" type="text" label={translations.maximumInvestment}
            required="" placeholder={translations.maximumInvestmentPlaceholder}
            className="input" labelClass="" patternValue="" patternMessage=""
          />
        </div>
        <div className="flex w-full flex-col">
          <TextArea
            title={translations.preferredAreas} register={register} errors={errors}
            placeholder={translations.preferredAreasPlaceholder}
            nameTextArea="preferredAreas" patternMessage="" patternValue=""
            required={translations.preferredAreasRequired} rows={3} maxLength={1450}
            maxLengthMessage={translations.preferredAreasErrorMessage} validate=""
          />
          <TextArea
            title={translations.howDidYouKnowUs} register={register} errors={errors}
            placeholder={translations.howDidYouKnowUsPlaceholder}
            nameTextArea="howDidYouKnowUs" patternMessage="" patternValue=""
            required="" rows={3} maxLength={1450}
            maxLengthMessage={translations.howDidYouKnowUsErrorMessage} validate=""
          />
        </div>
        <div className="mx-auto pb-4 mt-20 flex justify-center">
          <UnifiedFormSubmit
            lang={language} label={translations.sendButton}
            loadingLabel={translations.sendingButton} busy={isSubmitting}
            className="w-44 md:w-52"
          />
        </div>
      </form>
      <div className="mx-auto max-w-xl">
        <UnifiedFormStatus status={result?.status ?? null} message={result?.message} />
      </div>
    </div>
  );
}
