import { getServerTranslation } from 'app/i18n';
import  SpecialFeaturesClient from './SpecialFeaturesClient';

interface Feature {
  id: string;
  title: string;
  description: string;
  image: string;
  icon?: string;
  link: string;
}

export default function SpecialFeatures({lang}: {lang: string}) {
  const { t } = getServerTranslation(lang, 'mainPage');
  
  return (
    <section className="container mx-auto px-4 pb-20">
      <h2 className="text-5xl font-header font-bold text-center mb-16">{t('specialFeatures', { returnObjects: true}).title}</h2>
      <SpecialFeaturesClient
        lang={lang}
        features={t('specialFeatures', { returnObjects: true}).features}
        learnMore={t('specialFeatures', { returnObjects: true}).learnMore}
      />
    </section>
  );
}
