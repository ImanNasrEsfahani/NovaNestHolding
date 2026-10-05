import { getServerTranslation } from 'app/i18n';
import ContactUsFormClient from '@/components/common/form/ContactUsFormClient';

export default function ContactUsFormWrapper({lang}: {lang: string}) {
  const { t } = getServerTranslation(lang, 'formComponent');
  const { t: tCountry } = getServerTranslation(lang, 'countryInput');
  
  // Pass translations as props to client component
  const translations = {
    title: t('contactForm', { returnObjects: true }).title,
    subTitle: t('contactForm', { returnObjects: true }).subTitle,

    message: t('contactForm', { returnObjects: true }).message,
    messageRequired: t('contactForm', { returnObjects: true }).messageRequired,
    messagePlaceholder: t('contactForm', { returnObjects: true }).messagePlaceholder,
    messagePlaceholderErrorMessage: t('contactForm', { returnObjects: true }).messagePlaceholderErrorMessage,
    
    sendingButton: t("sendingButton"),
    sendButton: t("sendButton"),

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
  };

  return <ContactUsFormClient lang={lang} translations={translations} />;
}