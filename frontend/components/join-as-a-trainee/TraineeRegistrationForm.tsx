import { getServerTranslation } from 'app/i18n';
import TraineeRegistrationFormClient from '@/components/join-as-a-trainee/TraineeRegistrationFormClient';

export default function TraineeRegistrationForm({lang}: {lang: string}) {
  const { t } = getServerTranslation(lang, 'formComponent');
  const { t: tCountry } = getServerTranslation(lang, 'countryInput');
  
  // Pass translations as props to client component
  const translations = {
    formTitle: t('joinAsATrainee', { returnObjects: true }).formTitle,
    formSubtitle: t('joinAsATrainee', { returnObjects: true }).formSubtitle,

    choseFile: t('joinAsATrainee', { returnObjects: true }).choseFile,
    resumeQuestion: t('joinAsATrainee', { returnObjects: true }).resumeQuestion,
    yesLabel: t('yes'),
    noLabel: t('no'),

    sendButton: t('sendButton'),
    sendingButton: t('sendingButton'),
    successMessage: t('successMessage'),
    failedMessage: t('failedMessage'),

    firstName: t('firstName'),
    firstNameRequired: t('firstNameRequired'),
    firstNamePlaceholder: t('firstNamePlaceholder'),

    lastName: t('lastName'),
    lastNameRequired: t('lastNameRequired'),
    lastNamePlaceholder: t('lastNamePlaceholder'),
    
    email: t('email'),
    emailRequired: t('emailRequired'),
    emailErrorMessage: t('emailErrorMessage'),
    emailPlaceholder: t('emailPlaceholder'),

    phoneNumber: t('phoneNumber'),
    phoneNumberRequired: t('phoneNumberRequired'),
    phoneNumberErrorMessage: t('phoneNumberErrorMessage'),
    phoneNumberPlaceholder: t('phoneNumberPlaceholder'),

    countries: tCountry('countries', { returnObjects: true }),
    countryName: tCountry('countryName'),
    countryNameRequired: tCountry('countryNameRequired'),
    countryNamePlaceholder: tCountry('countryNamePlaceholder'),

    provinceOfResidence: tCountry('provinceOfResidence'),
    provinceOfResidenceRequired: tCountry('provinceOfResidenceRequired'),
    provinceOfResidencePlaceholder: tCountry('provinceOfResidencePlaceholder'),

    cityOfResidence: tCountry('cityOfResidence'),
    cityOfResidenceRequired: tCountry('cityOfResidenceRequired'),
    cityOfResidencePlaceholder: tCountry('cityOfResidencePlaceholder'),

    birthDate: t('birthDate'),  
    birthDateRequired: t('birthDateRequired'),
    birthDateErrorMessage: t('birthDateErrorMessage'),
    birthDateErrorMessageForFutureDate: t('birthDateErrorMessageForFutureDate'),
    birthDateErrorMessageForAge: t('birthDateErrorMessageForAge'),
    birthDatePlaceholder: t('birthDatePlaceholder'),

    TypeOfCollaboration: t('TypeOfCollaboration'),
    TypeOfCollaborationRequired: t('TypeOfCollaborationRequired'),
    TypeOfCollaborationPlaceholder: t('TypeOfCollaborationPlaceholder'),
    TypeOfCollaborationData: t('TypeOfCollaborationData', { returnObjects: true }) || [],

    FieldOfExpert: t('FieldOfExpert'),
    FieldOfExpertRequired: t('FieldOfExpertRequired'),
    FieldOfExpertPlaceholder: t('FieldOfExpertPlaceholder'),
    FieldOfExpertData: t('FieldOfExpertData', { returnObjects: true }) || [],
    
    FieldOfExpertOther: t('FieldOfExpertOther', { returnObjects: true }),
    FieldOfExpertOtherRequired: t('FieldOfExpertOtherRequired', { returnObjects: true }),
    FieldOfExpertOtherPlaceholder: t('FieldOfExpertOtherPlaceholder', { returnObjects: true }),

    FieldOfInterest: t('FieldOfInterest', { returnObjects: true }),
    FieldOfInterestRequired: t('FieldOfInterestRequired', { returnObjects: true }),
    FieldOfInterestPlaceholder: t('FieldOfInterestPlaceholder', { returnObjects: true }),
    FieldOfInterestData: t('FieldOfInterestData', { returnObjects: true }) || [],

    FieldOfInterestOther: t('FieldOfInterestOther', { returnObjects: true }),
    FieldOfInterestOtherRequired: t('FieldOfInterestOtherRequired', { returnObjects: true }),
    FieldOfInterestOtherPlaceholder: t('FieldOfInterestOtherPlaceholder', { returnObjects: true }),

    ExpertiesAreas: t('ExpertiesAreas'),
    ExpertiesAreasPlaceholder: t('ExpertiesAreasPlaceholder'),
    ExpertiesAreasRequired: t('ExpertiesAreasRequired'),
    ExpertiesAreasErrorMessage: t('ExpertiesAreasErrorMessage'),
    
    TellUsAboutYourself: t('TellUsAboutYourself'),
    TellUsAboutYourselfPlaceholder: t('TellUsAboutYourselfPlaceholder'),
    TellUsAboutYourselfRequired: t('TellUsAboutYourselfRequired'),
    TellUsAboutYourselfErrorMessage: t('TellUsAboutYourselfErrorMessage'),

    formDescription: t('joinAsATrainee.formDescription', { returnObjects: true }) as string[] || [],
  };

  return <TraineeRegistrationFormClient lang={lang} translations={translations} />;
}