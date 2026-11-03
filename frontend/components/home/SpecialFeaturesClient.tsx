// These are ordinary links and static content. Rendering them on the server
// avoids shipping the framer-motion animation runtime to the homepage.
interface Feature {
  id: string;
  title: string;
  description: string;
  link: string;
  image: string;
}

type Props = {
  lang: string;
  features: Feature[];
  learnMore: string;
};

export default function SpecialFeaturesClient({ lang, features, learnMore }: Props) {
  return (
    <div className={`grid gap-8 max-w-7xl mx-auto ${features.length === 1 ? 'grid-cols-1 justify-items-center' : 'grid-cols-1 md:grid-cols-2'}`}>
      {features.map((feature) => (
        <a
          key={feature.id}
          href={feature.link}
          aria-label={`${learnMore}: ${feature.title}`}
          className={`max-w-2xl group h-full rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col ${lang === 'fa' ? 'rtl' : 'ltr'}`}
        >
          <div className="w-full aspect-video relative overflow-hidden flex-none">
            <div
              className="absolute inset-0 bg-cover bg-center transform group-hover:scale-110 transition-transform duration-500 motion-reduce:transform-none"
              style={{ backgroundImage: `url(${feature.image})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          </div>
          <div className="w-full p-6 flex-1 flex flex-col justify-between">
            <h3 className="text-center md:text-start text-2xl font-bold text-gray-800 mb-4">
              {feature.title}
            </h3>
            <p className="text-justify text-base text-gray-700 mb-6">
              {feature.description}
            </p>
            <div className={`font-bold text-lg mt-auto ${lang === 'fa' ? 'text-left' : 'text-right'}`}>
              {learnMore}
              <span className={`inline-block ml-2 transform ${lang === 'fa' ? 'rotate-180' : ''}`}>→</span>
            </div>
          </div>
        </a>
      ))}
    </div>
  );
}
