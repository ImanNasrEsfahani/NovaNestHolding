import { getServerTranslation } from 'app/i18n';
import MentorRegistrationFormClient from '@/components/join-as-mentor/MentorRegistrationFormClient';

export default function MentorRegistrationForm({lang}: {lang: string}) {
  const { t } = getServerTranslation(lang, 'formComponent');
  const { t: tCountry } = getServerTranslation(lang, 'countryInput');
  const { t: tMentor } = getServerTranslation(lang, 'MentorForm');
  
  // Pass translations as props to client component
  const translations = {
    formTitle: t('joinUsForm', { returnObjects: true }).formTitle,
    formSubtitle: t('joinUsForm', { returnObjects: true }).formSubtitle,
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
    
    website: t('website'),
    websiteRequired: t('websiteRequired'),
    websitePlaceholder: t('websitePlaceholder'),
    websiteErrorMessage: t('websiteErrorMessage'),
    
    linkedin: t('linkedin'),
    linkedinRequired: t('linkedinRequired'),
    linkedinPlaceholder: t('linkedinPlaceholder'),
    linkedinErrorMessage: t('linkedinErrorMessage'),

    instagram: t('instagram'),
    instagramRequired: t('instagramRequired'),
    instagramPlaceholder: t('instagramPlaceholder'),
    instagramErrorMessage: t('instagramErrorMessage'),

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
    
    howDidYouKnowUs: t('howDidYouKnowUs'),
    howDidYouKnowUsPlaceholder: t('howDidYouKnowUsPlaceholder'),
    howDidYouKnowUsRequired: t('howDidYouKnowUsRequired'),
    howDidYouKnowUsErrorMessage: t('howDidYouKnowUsErrorMessage'),

    formDescription: tMentor('formDescription', { returnObjects: true }) as string[] || [],

    submitionMessage: tMentor('submitionMessage', { returnObjects: true }) as {
      title: string;
      description: string[];
      buttonText: string;
    } || { title: '', description: [], buttonText: '' },
  };

  return <MentorRegistrationFormClient lang={lang} translations={translations} />;
}