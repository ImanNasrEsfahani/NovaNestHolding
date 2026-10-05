import { getServerTranslation } from 'app/i18n';
import JoinOurTeamFormClient from '@/components/job-form/JoinOurTeamFormClient';

export default function JoinOurTeamForm({lang}: {lang: string}) {
  const { t } = getServerTranslation(lang, 'formComponent');
  const { t: tCountry } = getServerTranslation(lang, 'countryInput');

  // Pass translations as props to client component
  const translations = {
    
    formTitle: t('join-our-team', { returnObjects: true }).formTitle,
    formSubtitle: t('join-our-team', { returnObjects: true }).formSubtitle,
    resumeFile: t('join-our-team', { returnObjects: true }).resumeFile,
    choseFile: t('join-our-team', { returnObjects: true }).choseFile,
    
    sendButton: t('sendButton', { returnObjects: true }),
    sendingButton: t('sendingButton', { returnObjects: true }),
    successMessage: t('successMessage', { returnObjects: true }),
    failedMessage: t('failedMessage', { returnObjects: true }),
    
    firstName: t('firstName', { returnObjects: true }),
    firstNameRequired: t('firstNameRequired', { returnObjects: true }),
    firstNamePlaceholder: t('firstNamePlaceholder', { returnObjects: true }),
    
    lastName: t('lastName', { returnObjects: true }),
    lastNameRequired: t('lastNameRequired', { returnObjects: true }),
    lastNamePlaceholder: t('lastNamePlaceholder', { returnObjects: true }),
    
    email: t('email', { returnObjects: true }),
    emailRequired: t('emailRequired', { returnObjects: true }),
    emailErrorMessage: t('emailErrorMessage', { returnObjects: true }),
    emailPlaceholder: t('emailPlaceholder', { returnObjects: true }),
    
    phoneNumber: t('phoneNumber', { returnObjects: true }),
    phoneNumberRequired: t('phoneNumberRequired', { returnObjects: true }),
    phoneNumberErrorMessage: t('phoneNumberErrorMessage', { returnObjects: true }),
    phoneNumberPlaceholder: t('phoneNumberPlaceholder', { returnObjects: true }),

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

    TypeOfCollaboration: t('TypeOfCollaboration', { returnObjects: true }),
    TypeOfCollaborationRequired: t('TypeOfCollaborationRequired', { returnObjects: true }),
    TypeOfCollaborationPlaceholder: t('TypeOfCollaborationPlaceholder', { returnObjects: true }),
    TypeOfCollaborationData: t('TypeOfCollaborationData', { returnObjects: true }) || [],

    FieldOfExpert: t('FieldOfExpert', { returnObjects: true }),
    FieldOfExpertRequired: t('FieldOfExpertRequired', { returnObjects: true }),
    FieldOfExpertPlaceholder: t('FieldOfExpertPlaceholder', { returnObjects: true }),
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

    title: t('join-our-team', { returnObjects: true }).resumeQuestion,
    yesLabel: t('yes'),
    noLabel: t('no'),

    birthDate: t('birthDate', { returnObjects: true }),
    birthDateRequired: t('birthDateRequired', { returnObjects: true }),
    birthDateErrorMessage: t('birthDateErrorMessage', { returnObjects: true }),
    birthDateErrorMessageForFutureDate: t('birthDateErrorMessageForFutureDate', { returnObjects: true }),
    birthDateErrorMessageForAge: t('birthDateErrorMessageForAge', { returnObjects: true }),
    birthDatePlaceholder: t('birthDatePlaceholder', { returnObjects: true }),

    EducationLevels: t('EducationLevels', { returnObjects: true }),
    EducationLevelsRequired: t('EducationLevelsRequired', { returnObjects: true }),
    EducationLevelsErrorMessage: t('EducationLevelsErrorMessage', { returnObjects: true }),
    EducationLevelsPlaceholder: t('EducationLevelsPlaceholder', { returnObjects: true }),
    EducationLevelsData: t('EducationLevelsData', { returnObjects: true }),

    EducationField: t('EducationField', { returnObjects: true }),
    EducationFieldRequired: t('EducationFieldRequired', { returnObjects: true }),
    EducationFieldErrorMessage: t('EducationFieldErrorMessage', { returnObjects: true }),
    EducationFieldPlaceholder: t('EducationFieldPlaceholder', { returnObjects: true }),
    
    workHistorySummary: t('workHistorySummary', { returnObjects: true }),
    workHistorySummaryRequired: t('workHistorySummaryRequired', { returnObjects: true }),
    workHistorySummaryErrorMessage: t('workHistorySummaryErrorMessage', { returnObjects: true }),
    workHistorySummaryPlaceholder: t('workHistorySummaryPlaceholder', { returnObjects: true }),

    formDescription: t('join-our-team', { returnObjects: true }).formDescription || [],
  };

  return <JoinOurTeamFormClient lang={lang} translations={translations} />;
}