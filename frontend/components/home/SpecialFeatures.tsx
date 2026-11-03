import { getServerTranslation } from 'app/i18n';
import SpecialFeaturesClient from './SpecialFeaturesClient';

type Feature = {
  id: string;
  title: string;
  description: string;
  image: string;
  icon?: string;
  link: string;
};

type SpecialFeaturesContent = {
  title: string;
  features: Feature[];
  learnMore: string;
};

export default function SpecialFeatures({ lang }: { lang: string }) {
  const { t } = getServerTranslation(lang, 'mainPage');
  const content = t('specialFeatures', { returnObjects: true }) as SpecialFeaturesContent;

  return (
    <section className="container mx-auto px-4 pb-20">
      <h2 className="text-5xl font-header font-bold text-center mb-16">{content.title}</h2>
      <SpecialFeaturesClient lang={lang} features={content.features} learnMore={content.learnMore} />
    </section>
  );
}
