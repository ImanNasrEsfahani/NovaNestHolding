'use client';
import React, { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import NotificationSendForm from '@/components/common/form/NotificationSendForm';
import TextArea from '@/components/common/TextArea';
import PersonalInfoInput from '@/components/common/form/PersonalInfoInput';
import { useSubmit } from 'stores/dataStore';
import ButtonRefactor from '@/components/common/ButtonRefactor';
import Input from '@/components/common/form/Input';

import FormTitle from '@/components/common/form/FormTitle';
import { MentorRegistrationFormDataType, MentorRegistrationFormClientTranslations } from '@/types/global';
import { initialMentorRegistrationFormData } from '../../initials/initObjects';
import { submitMentorRegistrationForm } from '../../pages/api/join-as-mentor';
import { birthDateValidatorFactory } from '@/utils/birthDateValidatorFactory';

interface Props {
  lang: string;
  translations: MentorRegistrationFormClientTranslations;
}

export default function MentorRegistrationFormClient({ lang, translations }: Props) {
  const { send } = useSubmit();
  const [formSubmitted, setFormSubmitted] = useState(false); // State to track form submission
  const [redirectCountdown, setRedirectCountdown] = useState(15); // Countdown for redirection

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<MentorRegistrationFormDataType>({
    mode: 'onBlur',
    defaultValues: initialMentorRegistrationFormData
  });

  const {
    handleSubmitingChange,
    handleSendChange,
    handleNotifChange,
    handleSuccessChange
  } = useSubmit((s) => s);

  const birthValidate = useMemo(
    () =>
      birthDateValidatorFactory(18, {
        birthDateRequired: translations.birthDateRequired ?? 'Birth date is required',
        birthDateErrorMessage: translations.birthDateErrorMessage ?? 'Invalid birth date',
        birthDateErrorMessageForFutureDate: (translations as any).birthDateErrorMessageForFutureDate ?? translations.birthDateErrorMessage ?? 'Birth date cannot be in the future',
        birthDateErrorMessageForAge: (translations as any).birthDateErrorMessageForAge ?? translations.birthDateErrorMessage ?? 'You must be at least 18 years old',
      }),
    [
      translations.birthDateRequired,
      translations.birthDateErrorMessage,
      // include optional keys if present
      (translations as any).birthDateErrorMessageForFutureDate,
      (translations as any).birthDateErrorMessageForAge,
    ]
  );

  const onSubmit = async (formData: MentorRegistrationFormDataType) => {
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

    // Send the form data to the API.
    submitMentorRegistrationForm(sendFormData)
      .then(() => {
        handleSuccessChange(true);
        handleNotifChange(true);
        handleSendChange(false);
        reset(initialMentorRegistrationFormData); // Country does not reset
        setFormSubmitted(true); // Set form as submitted
        setTimeout(() => {
          handleNotifChange(false);
        }, 10000); // 10 seconds in milliseconds

        // Start countdown for redirection
        const interval = setInterval(() => {
          setRedirectCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(interval);
              window.location.href = '/'; // Redirect to homepage
            }
            return prev - 1;
          });
        }, 1000);
      })
      .catch(() => {
        handleSuccessChange(false);
        handleNotifChange(false);
        handleSendChange(false);
        reset(initialMentorRegistrationFormData);

        setTimeout(() => {
          handleNotifChange(false);
        }, 10000); // 10 seconds in milliseconds
      });
  };

  const errorsList = Object.entries(errors).map(([name, value]) => ({
    name: name,
    value: value
  }));

  return (
    <>
      <div className="w-full max-w-responsive mx-auto py-20">
        {!formSubmitted ? (
          <>
            <div className="h-[75px] md:h-[125px]">
              <FormTitle
                formTitle={translations.formTitle}
                formSubtitle={translations.formSubtitle}
              />
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="w-full">
              <div className="grid grid-cols-1 gap-6 mt-20 md:grid-cols-2 xl:grid-cols-3">
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
                    FieldOfExpert: '',
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
                    FieldOfInterestOtherPlaceholder: translations.FieldOfInterestOtherPlaceholder
                  }}
                />
                <Input
                  id="birthDate"
                  register={register}
                  errors={errors}
                  nameInput="birthDate"
                  type="date"
                  label={translations.birthDate}
                  required={translations.birthDateRequired}
                  patternValue="(?:\d{1,2}[-/\s]\d{1,2}[-/\s]'?\d{2,4})|(?:\d{2,4}[-/\s]\d{1,2}[-/\s]\d{1,2})|(?:(?:January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sept|Sep|Oct|Nov|Dec)[\s-/,]*?\d{1,2}(?:\s)*(?:rd|th|st)?(?:\s)*[-/,]?(?:\s)*'?\d{2,4})|(?:\d{1,2}(?:\s)*(?:rd|th|st)?(?:\s)*(?:January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sept|Sep|Oct|Nov|Dec)(?:\s)*?[-/,]?(?:\s)*'?\d{2,4})"
                  patternMessage={translations.birthDateErrorMessage}
                  placeholder={translations.birthDatePlaceholder}
                  className="input"
                  labelClass=""
                  validate={birthValidate}
                />

                <Input
                  id="website"
                  register={register}
                  errors={errors}
                  nameInput="website"
                  type="url"
                  label={translations.website}
                  required=""
                  placeholder={translations.websitePlaceholder}
                  className="input"
                  labelClass=""
                  patternValue="^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/.*)?$"
                  patternMessage={translations.websiteErrorMessage}
                />

                <Input
                  id="linkedin"
                  register={register}
                  errors={errors}
                  nameInput="linkedin"
                  type="url"
                  label={translations.linkedin}
                  required=""
                  placeholder={translations.linkedinPlaceholder}
                  className="input"
                  labelClass=""
                  patternValue="^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/.*)?$"
                  patternMessage={translations.linkedinErrorMessage}
                />

                <Input
                  id="instagram"
                  register={register}
                  errors={errors}
                  nameInput="instagram"
                  type="url"
                  label={translations.instagram}
                  required=""
                  placeholder={translations.instagramPlaceholder}
                  className="input"
                  labelClass=""
                  patternValue="^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/.*)?$"
                  patternMessage={translations.instagramErrorMessage}
                />

              </div>
              <div className="flex flex-col w-full">
                <TextArea
                  title={translations.ExpertiesAreas}
                  register={register}
                  errors={errors}
                  placeholder={translations.ExpertiesAreasPlaceholder}
                  nameTextArea="ExpertiesAreas"
                  patternMessage=""
                  patternValue=""
                  required={translations.ExpertiesAreasRequired}
                  rows={5}
                  maxLength={1450}
                  maxLengthMessage={translations.ExpertiesAreasErrorMessage}
                  validate=""
                />

                <TextArea
                  title={translations.howDidYouKnowUs}
                  register={register}
                  errors={errors}
                  placeholder={translations.howDidYouKnowUsPlaceholder}
                  nameTextArea="howDidYouKnowUs"
                  patternMessage=""
                  patternValue=""
                  // required={translations.howDidYouKnowUsRequired}
                  required=""
                  rows={3}
                  maxLength={1450}
                  maxLengthMessage={translations.howDidYouKnowUsErrorMessage}
                  validate=""
                />
              </div>

              <div className="w-full max-w-responsive mx-auto px-2 md:px-9 pt-6 pb-6">
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
          </>
        ) : (
          <div className="text-center">
            <h3 className="text-3xl font-bold text-green-600">
              Your application has been successfully submitted.
            </h3>
            <p className="mt-4 text-gray-700">
              Our team will review your information and contact you if your profile is selected for the next steps.
            </p>
            <p className="mt-2 text-gray-500">
              You will be redirected to the homepage shortly… ({redirectCountdown})
            </p>
            <button
              onClick={() => (window.location.href = '/')}
              className="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Go to Homepage
            </button>
          </div>
        )}
        <NotificationSendForm lang={lang} successMessage={translations.successMessage} failedMessage={translations.failedMessage} />
      </div>
    </>
  );
}
