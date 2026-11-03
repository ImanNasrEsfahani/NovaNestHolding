'use client';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { StartupsFormDataType } from '@/types/global';
import { initialStartupsFormData } from '../../initials/initObjects';
import StartupFormPersonalInformation from '@/components/startups-form/StartupFormPersonalInformation';
// import StartupFormIdea from '@/components/startups-form/StartupFormIdea';
import { UnifiedFormStatus } from '@/components/common/form/UnifiedFormSubmit';
// import GetCsrfToken from '@/utils/get-csrf-token';
import { submitStartupsForm } from '@/services/forms/startups-form';
import { useSubmit } from 'stores/dataStore';
import { useFile } from 'stores/fileStore';
import FormTitle from '@/components/common/form/FormTitle';
import ButtonRefactor from '@/components/common/ButtonRefactor';
import TextArea from '@/components/common/TextArea';

import StartUpMvpRefactore from '@/components/startups-form/StartUpMvpRefactore';
import StartUpFirstSaleRefactor from '@/components/startups-form/StartUpFirstSaleRefactor';
import StartUpSaleDevelopRefactore from '@/components/startups-form/StartUpSaleDevelopRefactore';

interface Translations {
  secondTitle: string;
  MVP: string;
  FirstSale: string;
  SaleDevelopment: string;
  sendButton: string;
  sendingButton: string;
  successMessage: string;
  failedMessage: string;

  formTitle: string;
  formSubtitle: string;

  countries: string[];
  countryName: string;
  countryNameRequired: string;
  countryNamePlaceholder: string;

  provinceOfResidence: string;
  provinceOfResidenceRequired: string;
  provinceOfResidencePlaceholder: string;

  cityOfResidence: string;
  cityOfResidenceRequired: string;
  cityOfResidencePlaceholder: string;

  accelerators: string;
  acceleratorsRequired: string;
  acceleratorsPlaceholder: string;
  acceleratorsErrorMessage: string;

  howDidYouKnowUs: string;
  howDidYouKnowUsRequired: string;
  howDidYouKnowUsPlaceholder: string;
  howDidYouKnowUsErrorMessage: string;
}

interface Props {
  lang: string;
  translations: Translations;
}

export default function StartupFormFormClient({ lang, translations }: Props) {

  const {
    register,
    handleSubmit,
    formState: { errors, submitCount },
    reset,
    setValue
  } = useForm<StartupsFormDataType>({
    mode: 'onBlur',
    defaultValues: initialStartupsFormData
  });


  const {
    // csrfToken,
    // handleTokenChange,
    handleSubmitingChange,
    handleSendChange,
    handleNotifChange,
    handleSuccessChange,
    startupFormType,
    setStartUpFormType,
    filesCounter,
    handleFileCounterChange,
    solutionsLevel,
    handleSolutionsLevelChange
  } = useSubmit((s) => s)

  const {
    filePostBussines,
    filePostPitch,
    filePostFinancial,
    handleBusinessFileChange,
    handleFinancialFileChange,
    handlePitchFileChange,
    handleFinancialModelFileChange
  } = useFile((s) => s)

  const { send } = useSubmit();
  const [submissionResult, setSubmissionResult] = useState<{ status: 'success' | 'pending' | 'error'; message: string } | null>(null);


  const onSubmit = async (formData: StartupsFormDataType) => {
    setSubmissionResult(null);
    handleSendChange(true);
    const sendFormData = new FormData();
    const filePostMap = {
      businessPlanFile: filePostBussines.businessPlanFile,
      pitchDeckFile: filePostPitch.pitchDeckFile,
      financialFile: filePostFinancial.financialFile,
    };
    for (const [fieldName, file] of Object.entries(filePostMap)) {
      if (file instanceof File) sendFormData.append(fieldName, file, file.name);
    }
    Object.entries(formData).forEach(([fieldName, fieldValue]) => {
      if (fieldValue !== null && fieldValue !== undefined &&
          typeof fieldValue !== 'object') {
        sendFormData.append(fieldName, String(fieldValue));
      }
    });

    try {
      const response = await submitStartupsForm(sendFormData);
      const reference = response.data?.reference;
      if ((response.status !== 201 && response.status !== 202) ||
          !Number.isInteger(reference) || reference <= 0) {
        throw new Error('Server did not confirm the saved submission');
      }
      // Clear attachments in this route's scoped store ONLY after Django
      // confirms a saved record; keep everything intact on network errors.
      handleBusinessFileChange(null);
      handlePitchFileChange(null);
      handleFinancialFileChange(null);
      handleFinancialModelFileChange(null);
      reset(initialStartupsFormData);
      setStartUpFormType('');
      if (response.status === 202 || response.data.notifications_sent !== true) {
        setSubmissionResult({
          status: 'pending',
          message: lang === 'fa'
            ? `درخواست شما با شماره پیگیری #${reference} ذخیره شد، اما برخی اعلان‌های ایمیلی در انتظارند. لطفاً دوباره ثبت نکنید.`
            : `Your submission was saved (#${reference}), but some email notifications are pending. Please do not submit again.`,
        });
      } else {
        setSubmissionResult({ status: 'success', message: `${translations.successMessage} (#${reference})` });
      }

    } catch (error) {
      // Network, authentication and validation failures must NEVER erase entries.
      // Preserve any CV already selected in the upload component/state.
      setSubmissionResult({ status: 'error', message: translations.failedMessage });

      console.error('Startup Validation submission failed', error);
    } finally {
      handleSendChange(false);
    }
  };

  // register radio field once so validation works and we can reuse handlers
  const startupField = register('startupType', {
    required: 'Please select one option'
  });

  const errorsList = Object.entries(errors).map(([name, value]) => ({
    name: name,
    value: value
  }));


  return (
    <div className="max-w-responsive mx-auto pt-12 pb-20">
      <div className="h-[75px] md:h-[125px]">
        <FormTitle
          formTitle={translations.formTitle}
          formSubtitle={translations.formSubtitle}
        />
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="w-full mx-auto mt-9">
        <StartupFormPersonalInformation
          countries={translations.countries}
          countryName={translations.countryName}
          countryNameRequired={translations.countryNameRequired}
          countryNamePlaceholder={translations.countryNamePlaceholder}
          provinceOfResidence={translations.provinceOfResidence}
          provinceOfResidenceRequired={translations.provinceOfResidenceRequired}
          provinceOfResidencePlaceholder={translations.provinceOfResidencePlaceholder}
          cityOfResidence={translations.cityOfResidence}
          cityOfResidenceRequired={translations.cityOfResidenceRequired}
          cityOfResidencePlaceholder={translations.cityOfResidencePlaceholder}

          lang={lang}
          register={register}
          errors={errors}
        />

        <div className="bg-[#222222CC]">
          <p className="mb-3 border-b px-10 py-5 text-2xl text-white">
            {translations.secondTitle}
          </p>
        </div>

        <div className='w-full h-auto px-0 md:px-4'>
          <div className='h-auto w-full flex flex-col gap-2'>
            <div className="h-auto w-full grid gap-6 grid-cols-1 lg:grid-cols-3">
              {['MVP', 'FirstSale', 'SaleDevelopment'].map((key) => {
                const label = (translations as any)[key];
                const isSelected = startupFormType === label;

                return (
                  <div className="col-span-1" key={key}>
                    <div
                      className={`w-full h-auto bg-whiteGold drop-shadow-md px-2 py-4 rounded-lg transition-shadow cursor-pointer ${isSelected ? 'ring-2 ring-primary/60' : ''
                        }`}
                      onClick={() => {
                        const syntheticEvent = {
                          target: { value: label, name: 'startupType' }
                        } as unknown as React.ChangeEvent<HTMLInputElement>;
                        startupField.onChange?.(syntheticEvent);
                        setStartUpFormType?.(label);
                      }}
                    >
                      <div className="flex flex-row items-center gap-3">
                        <div className={`border-2 rounded-full p-1 transition-colors ${isSelected ? 'border-primary' : 'border-gray-300'}`}>
                          <div
                            className={`relative size-4 rounded-full transition-all ${isSelected ? 'bg-primary' : 'bg-whiteGold'
                              } ${errors.startupType ? 'border-2 border-red-500' : ''}`}
                          >
                            <input
                              type="radio"
                              className="absolute inset-0 size-full opacity-0 cursor-pointer"
                              value={label}
                              {...startupField}
                              checked={isSelected}
                              onChange={(e) => {
                                startupField.onChange?.(e);
                                setStartUpFormType?.(e.target.value);
                              }}
                              aria-invalid={!!errors.startupType}
                            />
                          </div>
                        </div>

                        <span className="font-heading font-medium">
                          {label}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* show validation error for the radio group */}
            {errors.startupType && (
              <p className="mt-2 text-sm text-red-500" role="alert">
                {errors.startupType?.message ?? 'Please select one option'}
              </p>
            )}

            <div className='w-full'>
              {/* MVP section - render only when selected */}
              {startupFormType === translations.MVP && (
                <div className="overflow-hidden transition-[max-height,opacity,transform,padding] duration-700 ease-out origin-top min-h-0 opacity-100 translate-y-0 py-6 pointer-events-auto">
                  <StartUpMvpRefactore
                    lang={lang}
                    handleFileCounterChange={handleFileCounterChange}
                    handlePitchFileChange={handlePitchFileChange}
                    handleBusinessFileChange={handleBusinessFileChange}
                    handleFinancialFileChange={handleFinancialFileChange}
                    filesCounter={filesCounter}
                    register={register}
                    errors={errors}
                    setValue={setValue}
                    handleSolutionsLevelChange={handleSolutionsLevelChange}
                    solutionsLevel={solutionsLevel}
                    handleFinancialModelFileChange={handleFinancialModelFileChange}
                    required={startupFormType === translations.MVP}
                    submitCount={submitCount}
                  />
                </div>
              )}

              {/* First Sale section */}
              {startupFormType === translations.FirstSale && (
                <div className="overflow-hidden transition-[max-height,opacity,transform,padding] duration-700 ease-out origin-top min-h-0 opacity-100 translate-y-0 py-6 pointer-events-auto">
                  <StartUpFirstSaleRefactor
                    lang={lang}
                    handleFileCounterChange={handleFileCounterChange}
                    handlePitchFileChange={handlePitchFileChange}
                    handleBusinessFileChange={handleBusinessFileChange}
                    handleFinancialFileChange={handleFinancialFileChange}
                    filesCounter={filesCounter}
                    register={register}
                    errors={errors}
                    setValue={setValue}
                    handleSolutionsLevelChange={handleSolutionsLevelChange}
                    solutionsLevel={solutionsLevel}
                    handleFinancialModelFileChange={handleFinancialModelFileChange}
                    required={startupFormType === translations.FirstSale}
                    submitCount={submitCount}
                  />
                </div>
              )}

              {/* Sale Development section */}
              {startupFormType === translations.SaleDevelopment && (
                <div className="overflow-hidden transition-[max-height,opacity,transform,padding] duration-700 ease-out origin-top min-h-0 opacity-100 translate-y-0 py-6 pointer-events-auto">
                  <StartUpSaleDevelopRefactore
                    lang={lang}
                    handleFileCounterChange={handleFileCounterChange}
                    handlePitchFileChange={handlePitchFileChange}
                    handleBusinessFileChange={handleBusinessFileChange}
                    handleFinancialFileChange={handleFinancialFileChange}
                    filesCounter={filesCounter}
                    register={register}
                    errors={errors}
                    setValue={setValue}
                    handleSolutionsLevelChange={handleSolutionsLevelChange}
                    solutionsLevel={solutionsLevel}
                    handleFinancialModelFileChange={handleFinancialModelFileChange}
                    required={startupFormType === translations.SaleDevelopment}
                    submitCount={submitCount}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        <br />
        <hr className=" my-5 mt-0" />

        <div className="mx-auto lg:px-4">
          <TextArea
            title={translations.accelerators}
            register={register}
            errors={errors}
            required={translations.acceleratorsRequired}
            nameTextArea={'cooperatedWithInvestors'}
            patternValue={''}
            patternMessage={''}
            placeholder={translations.acceleratorsPlaceholder}
            maxLength={1450}
            maxLengthMessage={translations.acceleratorsErrorMessage}
            validate=""
          />
        </div>
        <div className="mx-auto lg:px-4">
          <TextArea
            title={translations.howDidYouKnowUs}
            register={register}
            errors={errors}
            required={translations.howDidYouKnowUsRequired}
            nameTextArea={'howDidYouKnowUs'}
            patternValue={''}
            patternMessage={''}
            placeholder={translations.howDidYouKnowUsPlaceholder}
            maxLength={1450}
            maxLengthMessage={translations.howDidYouKnowUsErrorMessage}
            validate=""
          />
        </div>

        <div className="mx-auto pb-4 mt-20">
          <ButtonRefactor
            type="submit"
            text={send ? translations.sendingButton : translations.sendButton}
            disabled={Array.isArray(errorsList) && errorsList.length > 0}
            errorList={Array.isArray(errorsList) && errorsList.length > 0 ? errorsList.map((e) => e.name) : []}
          />
        </div>
        <UnifiedFormStatus status={submissionResult?.status ?? null} message={submissionResult?.message} />
      </form>
    </div >
  );
}
