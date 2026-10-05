'use client';
import React from 'react';
import { useForm } from 'react-hook-form';
import { InvestorRegistrationFormDataType } from '@/types/global';
import NotificationSendForm from '@/components/common/form/NotificationSendForm';
import TextArea from '@/components/common/TextArea';
import { initialInvestorRegistrationFormData } from '../../initials/initObjects';
import { submitInvestorRegistrationForm } from '../../pages/api/investor-registration';
import PersonalInfoInput from '@/components/common/form/PersonalInfoInput';
import { useSubmit } from 'stores/dataStore';
import ButtonRefactor from '@/components/common/ButtonRefactor';
import Input from '@/components/common/form/Input';
import FormTitle from '@/components/common/form/FormTitle';

interface Translations {
  formTitle: string;
  formSubtitle: string;

  birthDate: string;
  birthDateErrorMessage: string;
  birthDatePlaceholder: string;
  companyName: string;
  companyNameRequired: string;
  companyNamePlaceholder: string;
  maximumInvestment: string;
  maximumInvestmentRequired: string;
  maximumInvestmentPlaceholder: string;
  preferredAreas: string;
  preferredAreasPlaceholder: string;
  preferredAreasRequired: string;
  preferredAreasErrorMessage: string;
  howDidYouKnowUs: string;
  howDidYouKnowUsPlaceholder: string;
  howDidYouKnowUsErrorMessage: string;
  howDidYouKnowUsRequired: string;
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

export default function InvestorRegistrationFormClient({ lang, translations }: Props) {
  const { send } = useSubmit();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<InvestorRegistrationFormDataType>({
    mode: 'onBlur',
    defaultValues: initialInvestorRegistrationFormData
  });

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

  const onSubmit = async (formData: InvestorRegistrationFormDataType) => {
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
    submitInvestorRegistrationForm(sendFormData)
      .then(() => {
        handleSuccessChange(true);
        handleNotifChange(true);
        handleSendChange(false);
        reset(initialInvestorRegistrationFormData); // Country does not reset
        setTimeout(() => {
          handleNotifChange(false);
        }, 10000); // 10 seconds in milliseconds
      })
      .catch(() => {
        handleSuccessChange(true);
        handleNotifChange(false);
        handleSendChange(false);
        reset(initialInvestorRegistrationFormData);

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
      <div className="w-full max-w-responsive mx-auto">
        <div className="h-[75px] md:h-[125px]">
          <FormTitle
            formTitle={translations.formTitle}
            formSubtitle={translations.formSubtitle}
          />
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="w-full">
          <div className="grid grid-cols-1 gap-6 mt-12 md:grid-cols-2 xl:grid-cols-3">
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
                FieldOfInterestOtherPlaceholder: translations.FieldOfInterestOtherPlaceholder
              }}
            />

            <Input
              id="investmentCeiling"
              register={register}
              errors={errors}
              nameInput="investmentCeiling"
              type="text"
              label={translations.maximumInvestment}
              // required={translations.maximumInvestmentRequired}
              required=""
              placeholder={translations.maximumInvestmentPlaceholder}
              className="input"
              labelClass=""
              patternValue=""
              patternMessage=""
            />
          </div>

          <div className="flex flex-col gap-0">
            <TextArea
              title={translations.preferredAreas}
              register={register}
              errors={errors}
              placeholder={translations.preferredAreasPlaceholder}
              nameTextArea="preferredAreas"
              patternMessage=""
              patternValue=""
              required={translations.preferredAreasRequired}
              rows={3}
              maxLength={1450}
              maxLengthMessage={translations.preferredAreasErrorMessage}
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
    </>
  );
}
