import { getServerTranslation } from 'app/i18n';
import InvestorRegistrationFormClient from '@/components/investor-registration/InvestorRegistrationFormClient';

export default function InvestorRegistrationForm({lang}: {lang: string}) {
  const { t } = getServerTranslation(lang, 'formComponent');
  const { t: tCountry } = getServerTranslation(lang, 'countryInput');
  const { t: tInvestorForm } = getServerTranslation(lang, 'investorForm');

  // Pass translations as props to client component
  const translations = {
    formTitle: tInvestorForm('formTitle', { returnObjects: true }),
    formSubtitle: tInvestorForm('formSubtitle', { returnObjects: true }),
    
    birthDate: t('birthDate'),
    birthDateErrorMessage: t('birthDateErrorMessage'),
    birthDatePlaceholder: t('birthDatePlaceholder'),
    companyName: t('companyName'),
    companyNameRequired: t('companyNameRequired'),
    companyNamePlaceholder: t('companyNamePlaceholder'),
    maximumInvestment: t('maximumInvestment'),
    maximumInvestmentRequired: t('maximumInvestmentRequired'),
    maximumInvestmentPlaceholder: t('maximumInvestmentPlaceholder'),
    preferredAreas: t('preferredAreas'),
    preferredAreasPlaceholder: t('preferredAreasPlaceholder'),
    preferredAreasRequired: t('preferredAreasRequired'),
    preferredAreasErrorMessage: t('preferredAreasErrorMessage'),
    howDidYouKnowUs: t('howDidYouKnowUs'),
    howDidYouKnowUsPlaceholder: t('howDidYouKnowUsPlaceholder'),
    howDidYouKnowUsErrorMessage: t('howDidYouKnowUsErrorMessage'),
    howDidYouKnowUsRequired: t('howDidYouKnowUsRequired'),
    sendButton: t('sendButton'),
    sendingButton: t('sendingButton'),
    successMessage: t('successMessage'),
    failedMessage: t('failedMessage'),

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

    TypeOfCollaboration: t('TypeOfCollaboration'),
    TypeOfCollaborationRequired: t('TypeOfCollaborationRequired'),
    TypeOfCollaborationPlaceholder: t('TypeOfCollaborationPlaceholder'),
    TypeOfCollaborationData: t('TypeOfCollaborationData', { returnObjects: true }),

    FieldOfExpert: t('FieldOfExpert'),
    FieldOfExpertRequired: t('FieldOfExpertRequired'),
    FieldOfExpertPlaceholder: t('FieldOfExpertPlaceholder'),
    FieldOfExpertData: t('FieldOfExpertData', { returnObjects: true }),
    
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
  };


  return <InvestorRegistrationFormClient lang={lang} translations={translations} />
}