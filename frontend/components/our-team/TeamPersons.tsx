import { getServerTranslation } from 'app/i18n';
import TeamPersonsClient from '@/components/our-team/TeamPersonsClient';

export default function TeamPersons({lang}: {lang: string}) {
  const { t } = getServerTranslation(lang, 'ourTeam');
  
  // Pass translations as props to client component
  const translations = {
    persons: t('persons', { returnObjects: true }),
    roles: t('roles', { returnObjects: true }),
    defaultRole: t('defaultRole'),

    
  };

  return <TeamPersonsClient 
    lang={lang} 
    persons={translations.persons} 
    roles={translations.roles} 
    defaultRole={translations.defaultRole}
    // onRoleSelect={(role: string) => {}} 
  />;
}