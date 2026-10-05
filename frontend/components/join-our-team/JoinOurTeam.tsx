import { getServerTranslation } from 'app/i18n';
import JoinOurTeamClient from 'components/join-our-team/JoinOurTeamClient';

export default function JoinOurTeam({ lang }: { lang: string }) {
  const { t } = getServerTranslation(lang, 'formComponent');

  // Prepare all translations that the client component needs
  const translations = {
    // Work with US specific translations
    joinOurTeam: t('join-our-team', { returnObjects: true }),
    
    // Universities and language levels
    universities: t("universities", { returnObjects: true }),
    langLevel: t("langLevel", { returnObjects: true }),
    
    // Form field translations
    firstName: t('firstName'),
    firstNameRequired: t('firstNameRequired'),
    firstNamePlaceholder: t('firstNamePlaceholder'),
    lastName: t('lastName'),
    lastNameRequired: t('lastNameRequired'),
    lastNamePlaceholder: t('lastNamePlaceholder'),
    phoneNumber: t('phoneNumber'),
    phoneNumberRequired: t('phoneNumberRequired'),
    phoneNumberPlaceholder: t('phoneNumberPlaceholder'),
    phoneNumberErrorMessage: t('phoneNumberErrorMessage'),
    sendButton: t('sendButton'),
    sendingButton: t('sendingButton'),
    successMessage: t('successMessage'),
    failedMessage: t('failedMessage')
  };

  return <JoinOurTeamClient translations={translations} lang={lang} />;
}