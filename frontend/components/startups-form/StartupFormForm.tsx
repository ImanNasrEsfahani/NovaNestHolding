import { getServerTranslation } from 'app/i18n';
import StartupFormFormClient from '@/components/startups-form/StartupFormFormClient';

export default function StartupFormForm({lang}: {lang: string}) {
  const { t } = getServerTranslation(lang, 'formComponent');
  const { t: tCountry } = getServerTranslation(lang, 'countryInput');
  
  // Pass translations as props to client component
  const translations = {
    secondTitle: t('startUp', { returnObjects: true }).secondTitle,
    MVP: t('MVP'),
    FirstSale: t('FirstSale'),
    SaleDevelopment: t('SaleDevelopment'),
    sendButton: t('sendButton'),
    sendingButton: t('sendingButton'),
    successMessage: t('successMessage'),
    failedMessage: t('failedMessage'),
    
    formTitle: t('startUp', { returnObjects: true }).formTitle,
    formSubtitle: t('startUp', { returnObjects: true }).formSubtitle,

    countries: tCountry('countries', { returnObjects: true }) || [],
    countryName: tCountry('countryName'),
    countryNameRequired: tCountry('countryNameRequired'),
    countryNamePlaceholder: tCountry('countryNamePlaceholder'),

    provinceOfResidence: tCountry('provinceOfResidence'),
    provinceOfResidenceRequired: tCountry('provinceOfResidenceRequired'),
    provinceOfResidencePlaceholder: tCountry('provinceOfResidencePlaceholder'),

    cityOfResidence: tCountry('cityOfResidence'),
    cityOfResidenceRequired: tCountry('cityOfResidenceRequired'),
    cityOfResidencePlaceholder: tCountry('cityOfResidencePlaceholder'),

    accelerators: t('startUp', { returnObjects: true }).commons.accelerators,
    acceleratorsRequired: t('startUp', { returnObjects: true }).commons.acceleratorsRequired,
    acceleratorsPlaceholder: t('startUp', { returnObjects: true }).commons.acceleratorsPlaceholder,
    acceleratorsErrorMessage: t('acceleratorsErrorMessage', { returnObjects: true }),
    
    howDidYouKnowUs: t('startUp', { returnObjects: true }).commons.knowUs,
    howDidYouKnowUsRequired: t('startUp', { returnObjects: true }).commons.KnowUsRequired,
    howDidYouKnowUsPlaceholder: t('startUp', { returnObjects: true }).commons.KnowUsPlaceholder,
    howDidYouKnowUsErrorMessage: t('howDidYouKnowUsErrorMessage', { returnObjects: true }),
  };

  return <StartupFormFormClient lang={lang} translations={translations} />
}