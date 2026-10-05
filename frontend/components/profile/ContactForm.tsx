'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { useSubmit } from 'stores/dataStore';

import TextArea from '@/components/common/TextArea';
import { ContactProfileForm } from '../../pages/api/profile/index';

import FormTitle from '@/components/common/form/FormTitle';
import PersonalInfoInput from '@/components/common/form/PersonalInfoInput';
import ButtonRefactor from '@/components/common/ButtonRefactor';
import NotificationSendForm from '@/components/common/form/NotificationSendForm';
import { ContactProfileFormDataType } from '@/types/global';
import { initialContactProfileFormData } from '../../initials/initObjects';

interface Translations {
  formTitle: string;
  formSubtitle: string;

  sendButton: string;
  sendingButton: string;
  successMessage: string;
  failedMessage: string;

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

  message: string;
  messageRequired: string;
  messagePlaceholder: string;
  messagePlaceholderErrorMessage: string;
}

interface Props {
  lang: string;
  translations: Translations;
}

export default function ContactForm({ lang, translations }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<ContactProfileFormDataType>({
    mode: 'onBlur',
    defaultValues: initialContactProfileFormData
  });

  const {
    // csrfToken,
    // handleTokenChange,
    handleSubmitingChange,
    handleSendChange,
    handleNotifChange,
    handleSuccessChange
  } = useSubmit((s) => s);

  const { send } = useSubmit();

  const onSubmit = async (formData: ContactProfileFormDataType) => {
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
    ContactProfileForm(sendFormData)
      .then((response) => {
        console.log(response);

        handleSuccessChange(true);
        handleNotifChange(true);
        handleSendChange(false);
        reset(initialContactProfileFormData); // Reset the form after successful submission
        setTimeout(() => {
          handleNotifChange(false);
        }, 10000); // 10 seconds in milliseconds
      })
      .catch(() => {
        handleNotifChange(true);
        handleSendChange(false);
        handleSuccessChange(false);
        reset(initialContactProfileFormData);

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
    <div className="w-full flex h-full flex-col items-center justify-between md:items-start">
      <div className="w-full h-[75px] md:h-[125px]">
        <FormTitle formTitle={translations.formTitle} formSubtitle={translations.formSubtitle} />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="w-full pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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


        <div className="mx-auto pb-2 mt-20">
          <ButtonRefactor
            type='submit'
            text={send ? translations.sendingButton : translations.sendButton}
            disabled={errorsList[0] ? true : false}
          />
        </div>
      </form>

      <NotificationSendForm lang={lang} successMessage={translations.successMessage} failedMessage={translations.failedMessage} />
    </div >
  );
}