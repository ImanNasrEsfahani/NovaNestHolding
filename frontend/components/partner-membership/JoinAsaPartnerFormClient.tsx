'use client';
import React from 'react';
import { useForm } from 'react-hook-form';
import { JoinAsaPartnerFormDataType } from '@/types/global';
import NotificationSendForm from '@/components/common/form/NotificationSendForm';
import TextArea from '@/components/common/TextArea';
// import GetCsrfToken from '@/utils/get-csrf-token';
import { initialJoinAsaPartnerFormData } from '../../initials/initObjects';
import { submitPartnerMembershipForm } from '../../pages/api/partner-membership';
import PersonalInfoInput from '@/components/common/form/PersonalInfoInput';
import { useSubmit } from 'stores/dataStore';
import ButtonRefactor from '@/components/common/ButtonRefactor';
import FormTitle from '@/components/common/form/FormTitle';
import Input from '../common/form/Input';

interface Translations {
  formTitle: string;
  formSubtitle: string;
  birthDate: string;
  birthDateErrorMessage: string;
  birthDatePlaceholder: string;
  companyName: string;
  companyNameRequired: string;
  companyNamePlaceholder: string;
  investmentCeiling: string;
  investmentCeilingRequired: string;
  investmentCeilingPlaceholder: string;
  howDidYouKnowUs: string;
  howDidYouKnowUsPlaceholder: string;
  howDidYouKnowUsRequired: string;
  howDidYouKnowUsErrorMessage: string;
  sendButton: string;
  sendingButton: string;

  successMessage: string;
  failedMessage: string;

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

  website: string;
  websiteRequired: string;
  websitePlaceholder: string;
  websiteErrorMessage: string;

  linkedin: string;
  linkedinRequired: string;
  linkedinPlaceholder: string;
  linkedinErrorMessage: string;

  briefIntroduction: string;
  briefIntroductionRequired: string;
  briefIntroductionPlaceholder: string;
  briefIntroductionErrorMessage: string;

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
}

interface Props {
  lang: string;
  translations: Translations;
}

export default function JoinAsaPartnerFormClient({ lang, translations }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<JoinAsaPartnerFormDataType>({
    mode: 'onBlur',
    defaultValues: initialJoinAsaPartnerFormData
  });

  const { send } = useSubmit();

  const {
    // csrfToken,
    // handleTokenChange,
    handleSubmitingChange,
    handleSendChange,
    handleNotifChange,
    handleSuccessChange
  } = useSubmit((s) => s);

  // useEffect(() => {
  //   async function fetchCsrfToken() {
  //     const token = await GetCsrfToken(
  //       `${process.env.NEXT_PUBLIC_DJANGO_HOST_URL}/get-csrf-token`
  //     );
  //     handleTokenChange(token);
  //   }

  //   fetchCsrfToken();
  // }, []);

  const onSubmit = async (formData: JoinAsaPartnerFormDataType) => {
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
    let notifTimeout: NodeJS.Timeout;

    submitPartnerMembershipForm(sendFormData)
      .then((response) => {
        handleSuccessChange(true);
        handleNotifChange(true);
        handleSendChange(false);
        reset(initialJoinAsaPartnerFormData); // Country does not reset

        console.log(response);

        notifTimeout = setTimeout(() => {
          handleNotifChange(false);
        }, 10000); // 10 seconds in milliseconds
      })
      .catch(() => {
        handleSuccessChange(true);
        handleNotifChange(false);
        handleSendChange(false);
        reset(initialJoinAsaPartnerFormData);
        notifTimeout = setTimeout(() => {
          handleNotifChange(false);
        }, 10000); // 10 seconds in milliseconds
      });
  };

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
      <form onSubmit={handleSubmit(onSubmit)} className="w-full">
        <div className="grid grid-cols-1 gap-6 mt-9  md:grid-cols-2 xl:grid-cols-3">
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
            id="companyName"
            register={register}
            errors={errors}
            nameInput="companyName"
            type="text"
            label={translations.companyName}
            required=""
            placeholder={translations.companyNamePlaceholder}
            className="input"
            labelClass=""
            patternValue=""
            patternMessage=""
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

        </div>
        <div className="flex flex-col w-full">
          <TextArea
            title={translations.briefIntroduction}
            register={register}
            errors={errors}
            placeholder={translations.briefIntroductionPlaceholder}
            nameTextArea="briefIntroduction"
            patternMessage=""
            patternValue=""
            required=""
            rows={5}
            maxLength={1450}
            maxLengthMessage={translations.briefIntroductionErrorMessage}
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
        <div className="mx-auto pb-4 mt-20">
          <ButtonRefactor
            type="submit"
            text={send ? translations.sendingButton : translations.sendButton}
            disabled={errorsList[0] ? true : false}
          />
        </div>
      </form>
      <NotificationSendForm lang={lang} successMessage={translations.successMessage} failedMessage={translations.failedMessage} />
    </div>
  );
}
