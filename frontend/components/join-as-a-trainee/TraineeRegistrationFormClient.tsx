'use client';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useFile } from 'stores/fileStore';
import NotificationSendForm from '@/components/common/form/NotificationSendForm';
import TextArea from '@/components/common/TextArea';
import PersonalInfoInput from '@/components/common/form/PersonalInfoInput';
import { useSubmit } from 'stores/dataStore';
import ButtonRefactor from '@/components/common/ButtonRefactor';
import Input from '@/components/common/form/Input';

import FormTitle from '@/components/common/form/FormTitle';
import { TraineeRegistrationFormDataType } from '@/types/global';
import { initialTraineeRegistrationFormData } from '../../initials/initObjects';
import { submitTraineeRegistrationForm } from '../../pages/api/join-as-a-trainee';
import { birthDateValidatorFactory } from '@/utils/birthDateValidatorFactory';
import YesOrNoQuestion from '@/components/startups-form/YesOrNoQuestion';
import FileUpload from '@/components/common/form/FileUpload';

interface Translations {
  formTitle: string;
  formSubtitle: string;

  sendButton: string;
  sendingButton: string;
  successMessage: string;
  failedMessage: string;
  choseFile: string;

  firstName: string;
  firstNameRequired: string;
  firstNamePlaceholder: string;

  lastName: string;
  lastNameRequired: string;
  lastNamePlaceholder: string;

  email: string;
  emailRequired: string;
  emailErrorMessage: string;
  emailPlaceholder: string;

  phoneNumber: string;
  phoneNumberRequired: string;
  phoneNumberErrorMessage: string;
  phoneNumberPlaceholder: string;

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

  TypeOfCollaboration: string;
  TypeOfCollaborationRequired: string;
  TypeOfCollaborationPlaceholder: string;
  TypeOfCollaborationData: { value: string; label: string }[];

  FieldOfExpert: string;
  FieldOfExpertRequired: string;
  FieldOfExpertPlaceholder: string;
  FieldOfExpertData: { value: string; label: string }[];

  FieldOfExpertOther: string;
  FieldOfExpertOtherRequired: string;
  FieldOfExpertOtherPlaceholder: string;

  FieldOfInterest: string;
  FieldOfInterestRequired: string;
  FieldOfInterestPlaceholder: string;
  FieldOfInterestData: { value: string; label: string }[];

  FieldOfInterestOther: string;
  FieldOfInterestOtherRequired: string;
  FieldOfInterestOtherPlaceholder: string;

  resumeQuestion: string;
  yesLabel: string;
  noLabel: string;

  birthDate: string;
  birthDateRequired: string;
  birthDateErrorMessage: string;
  birthDateErrorMessageForFutureDate: string;
  birthDateErrorMessageForAge: string;
  birthDatePlaceholder: string;

  ExpertiesAreas: string;
  ExpertiesAreasPlaceholder: string;
  ExpertiesAreasRequired: string;
  ExpertiesAreasErrorMessage: string;

  TellUsAboutYourself: string;
  TellUsAboutYourselfPlaceholder: string;
  TellUsAboutYourselfRequired: string;
  TellUsAboutYourselfErrorMessage: string;

  formDescription: string[];
}

interface Props {
  lang: string;
  translations: Translations;
}

export default function MentorRegistrationFormClient({ lang, translations }: Props) {
  const { send } = useSubmit();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    clearErrors,
    unregister
  } = useForm<TraineeRegistrationFormDataType>({
    mode: 'onBlur',
    defaultValues: initialTraineeRegistrationFormData
  });

  const {
    // csrfToken,
    // handleTokenChange,
    handleSubmitingChange,
    handleSendChange,
    handleNotifChange,
    handleSuccessChange
  } = useSubmit((s) => s);

  const { cvFileState, handleCvFileChange } = useFile();
  const onCvFileChange = (file: File | null) => handleCvFileChange({ cvFile: file ?? '' });
  const [fileCounterState, setFileCounter] = useState<boolean>(false);
  // toggle upload mode — clear errors for the optional group when enabling upload
  const setFileCounterAndClear = (v: boolean) => {
    setFileCounter(v);

    const fields: (keyof TraineeRegistrationFormDataType)[] = ['birthDate', 'fieldOfExpert', 'fieldOfExpertOther', 'tellUsAboutYourself'];

    if (v) {
      // when resume is uploaded we want these fields NOT validated also unregister them so validation rules are removed
      clearErrors(fields);
      unregister(fields);
      return;
    }

    clearErrors(fields);
    // re-register with the same rules used by the inputs
    register('fieldOfExpert', { required: translations.FieldOfExpertRequired || true });
    register('fieldOfExpertOther', { required: translations.FieldOfExpertOtherRequired || true });
    register('tellUsAboutYourself', { required: translations.TellUsAboutYourselfRequired || true });

    // register birthDate using the shared validator
    register('birthDate', { required: translations.birthDateRequired || true, validate: birthValidate });
  };

  const birthValidate = (value?: Date): string | true => {
    if (fileCounterState) return true;

    // convert Date to ISO yyyy-mm-dd string expected by the string-based validator
    const valStr =
      value instanceof Date ? value.toISOString().split('T')[0] : (typeof value === 'string' ? value : undefined);

    return birthDateValidatorFactory(14, {
      birthDateRequired: translations.birthDateRequired,
      birthDateErrorMessage: translations.birthDateErrorMessage,
      birthDateErrorMessageForFutureDate: translations.birthDateErrorMessageForFutureDate,
      birthDateErrorMessageForAge: translations.birthDateErrorMessageForAge
    })(valStr);
  };

  const onSubmit = async (formData: TraineeRegistrationFormDataType) => {
    // Set loading and sending states.
    handleSubmitingChange(true);
    handleSendChange(true);

    // Create a FormData object for form data.
    const sendFormData = new FormData();

    // Append all non-file form fields.
    Object.entries(formData).forEach(([fieldName, fieldValue]) => {
      if (typeof fieldValue !== 'object' || fieldValue === null) {
        sendFormData.append(fieldName, String(fieldValue));
      }
    });

    // Append the CV file if it exists
    if (cvFileState.cvFile && cvFileState.cvFile instanceof File) {
      sendFormData.append('cvFile', cvFileState.cvFile);
    }

    // Send the form data to the API.
    submitTraineeRegistrationForm(sendFormData)
      .then(() => {
        handleSuccessChange(true);
        handleNotifChange(true);
        handleSendChange(false);
        reset(initialTraineeRegistrationFormData); // Country does not reset
        handleCvFileChange({ cvFile: '' }); // Reset the file state
        setFileCounter(false); // Reset the file upload toggle
        setTimeout(() => {
          handleNotifChange(false);
        }, 10000); // 10 seconds in milliseconds
      })
      .catch(() => {
        handleSuccessChange(true);
        handleNotifChange(false);
        handleSendChange(false);
        reset(initialTraineeRegistrationFormData);
        handleCvFileChange({ cvFile: '' }); // Reset the file state
        setFileCounter(false); // Reset the file upload toggle

        setTimeout(() => {
          handleNotifChange(false);
        }, 10000); // 10 seconds in milliseconds
      });
  };

  const errorsList = Object.entries(errors).map(([name, value]) => ({
    name: name,
    value: value
  }));
  console.log('TraineeRegistrationFormClient error list render', { errorsList });

  return (
    <>
      <div className="max-w-responsive mx-auto pt-9">
        <div className="h-[75px] md:h-[125px]">
          <FormTitle
            formTitle={translations.formTitle}
            formSubtitle={translations.formSubtitle}
          />
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="w-full">
          <div className="grid grid-cols-1 gap-6 mt-9 md:grid-cols-2 xl:grid-cols-3">
            <PersonalInfoInput
              register={register}
              errors={errors}
              nameInputs={{
                firstName: 'firstName',
                lastName: 'lastName',
                email: 'email',
                phoneNumber: 'phoneNumber',
                countryOfResidence: 'countryOfResidence',
                provinceOfResidence: '',
                cityOfResidence: 'cityOfResidence',
                TypeOfCollaboration: '',
                FieldOfExpert: 'fieldOfExpert',
                FieldOfInterest: ''
              }}
              noLabel={false}
              translations={{

                firstName: translations.firstName,
                firstNameRequired: translations.firstNameRequired,
                firstNamePlaceholder: translations.firstNamePlaceholder,

                lastName: translations.lastName,
                lastNameRequired: translations.lastNameRequired,
                lastNamePlaceholder: translations.lastNamePlaceholder,

                email: translations.email,
                emailRequired: translations.emailRequired,
                emailErrorMessage: translations.emailErrorMessage,
                emailPlaceholder: translations.emailPlaceholder,

                phoneNumber: translations.phoneNumber,
                phoneNumberRequired: translations.phoneNumberRequired,
                phoneNumberErrorMessage: translations.phoneNumberErrorMessage,
                phoneNumberPlaceholder: translations.phoneNumberPlaceholder,

                countries: translations.countries,
                countryName: translations.countryName,
                countryNameRequired: translations.countryNameRequired,
                countryNamePlaceholder: translations.countryNamePlaceholder,

                provinceOfResidence: translations.provinceOfResidence,
                provinceOfResidenceRequired: translations.provinceOfResidenceRequired,
                provinceOfResidencePlaceholder: translations.provinceOfResidencePlaceholder,

                cityOfResidence: translations.cityOfResidence,
                cityOfResidenceRequired: translations.cityOfResidenceRequired,
                cityOfResidencePlaceholder: translations.cityOfResidencePlaceholder,

                TypeOfCollaboration: translations.TypeOfCollaboration,
                TypeOfCollaborationRequired: translations.TypeOfCollaborationRequired,
                TypeOfCollaborationPlaceholder: translations.TypeOfCollaborationPlaceholder,
                TypeOfCollaborationData: translations.TypeOfCollaborationData,

                FieldOfExpert: translations.FieldOfExpert,
                FieldOfExpertRequired: translations.FieldOfExpertRequired,
                FieldOfExpertPlaceholder: translations.FieldOfExpertPlaceholder,
                FieldOfExpertData: translations.FieldOfExpertData,

                FieldOfExpertOther: translations.FieldOfExpertOther,
                FieldOfExpertOtherRequired: translations.FieldOfExpertOtherRequired,
                FieldOfExpertOtherPlaceholder: translations.FieldOfExpertOtherPlaceholder,

                FieldOfInterest: translations.FieldOfInterest,
                FieldOfInterestRequired: translations.FieldOfInterestRequired,
                FieldOfInterestPlaceholder: translations.FieldOfInterestPlaceholder,
                FieldOfInterestData: translations.FieldOfInterestData,

                FieldOfInterestOther: translations.FieldOfInterestOther,
                FieldOfInterestOtherRequired: translations.FieldOfInterestOtherRequired,
                FieldOfInterestOtherPlaceholder: translations.FieldOfInterestOtherPlaceholder,
              }}
            />
          </div>

          <div className="w-full flex flex-col p-3 pt-12">
            <YesOrNoQuestion
              title={translations.resumeQuestion}
              yesLabel={translations.yesLabel}
              noLabel={translations.noLabel}
              value={fileCounterState}
              onChange={setFileCounterAndClear}
              name="fileCounter"
            />
            <div
              aria-hidden={!fileCounterState}
              className={`w-full md:max-w-lg 2xl:max-w-xl mt-2 mx-auto bg-whiteGold drop-shadow-md overflow-hidden transition-[max-height,opacity,transform,padding] duration-900 ease-out origin-top min-h-0
                          ${fileCounterState ? 'opacity-100 translate-y-0 pointer-events-auto' : 'max-h-0 opacity-0 -translate-y-2 py-0 pointer-events-none'}`}
            >
              <FileUpload
                nameInput="cvFile"
                required={fileCounterState ? true : false}
                errors={errors}
                label={translations.choseFile}
                onChange={onCvFileChange}
                disabled={!fileCounterState}
                file={cvFileState.cvFile}
              />
            </div>
          </div>


          <div
            aria-hidden={fileCounterState}
            className={`w-full transition-[max-height,opacity,transform,padding] duration-700 ease-out origin-top min-h-0
              ${!fileCounterState ? 'max-h-[1200px] opacity-100 translate-y-0 pointer-events-auto' : 'max-h-0 opacity-0 -translate-y-2 py-0 pointer-events-none'}`}
          >
            {/* disable native form controls while hidden to avoid focusable hidden elements */}
            <fieldset disabled={fileCounterState} className="w-full">
              <div className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 pt-6">
                <div className="col-span-1">
                  <Input
                    id="birthDate"
                    register={register}
                    errors={errors}
                    nameInput="birthDate"
                    type="date"
                    label={translations.birthDate}
                    // required={translations.birthDateRequired}
                    required=""
                    patternValue="(?:\d{1,2}[-/\s]\d{1,2}[-/\s]'?\d{2,4})|(?:\d{2,4}[-/\s]\d{1,2}[-/\s]\d{1,2})|(?:(?:January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sept|Sep|Oct|Nov|Dec)[\s-/,]*?\d{1,2}(?:\s)*(?:rd|th|st)?(?:\s)*[-/,]?(?:\s)*'?\d{2,4})|(?:\d{1,2}(?:\s)*(?:rd|th|st)?(?:\s)*(?:January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sept|Sep|Oct|Nov|Dec)(?:\s)*?[-/,]?(?:\s)*'?\d{2,4})"
                    patternMessage={translations.birthDateErrorMessage}
                    placeholder={translations.birthDatePlaceholder}
                    className="input"
                    labelClass=""
                    validate={birthValidate}
                  />
                </div>
              </div>

              <div className="flex flex-col w-full">
                <TextArea
                  title={translations.TellUsAboutYourself}
                  register={register}
                  errors={errors}
                  placeholder={translations.TellUsAboutYourselfPlaceholder}
                  nameTextArea="tellUsAboutYourself"
                  patternMessage=""
                  patternValue=""
                  // required={translations.TellUsAboutYourselfRequired}
                  required=""
                  rows={3}
                  maxLength={1450}
                  maxLengthMessage={translations.TellUsAboutYourselfErrorMessage}
                  validate=""
                />
              </div>
            </fieldset>
          </div>

          <div className="w-full max-w-responsive mx-auto px-2 md:px-9 py-6">
            {translations.formDescription.map((paragraph, index) => (
              <p key={index} className="text-sm font-normal text-gray-800 font-header">
                * {paragraph}
              </p>
            ))}
          </div>

          <div className="mx-auto pb-4">
            <ButtonRefactor
              type="submit"
              text={send ? translations.sendingButton : translations.sendButton}
              disabled={errorsList[0] ? true : false}
            />
          </div>
        </form>
        <NotificationSendForm lang={lang} successMessage={translations.successMessage} failedMessage={translations.failedMessage} />
      </div>
    </>
  );
}
