import { createInstance } from 'i18next';
// import resourcesToBackend from 'i18next-resources-to-backend';
import { initReactI18next } from 'react-i18next/initReactI18next';
import { getOptions } from './setting';
// import i18nextBrowserLanguagedetector from 'i18next-browser-languagedetector';
// import i18next from 'i18next';


const initI18next = (lng: string, ns: string | string[]) => {
  const i18nInstance = createInstance();
  
  // Create a synchronous resource loader using require
  const syncResourceLoader = (language: string, namespace: string) => {
    try {
      return require(`./locales/${language}/${namespace}.json`);
    } catch (error) {
      console.error(`Failed to load translation: ${language}/${namespace}`, error);
      return {};
    }
  };

  // Build resources synchronously
  const namespaces = Array.isArray(ns) ? ns : [ns];
  const resources: any = {};
  
  if (!resources[lng]) {
    resources[lng] = {};
  }
  
  namespaces.forEach(namespace => {
    resources[lng][namespace] = syncResourceLoader(lng, namespace);
  });

  i18nInstance
    .use(initReactI18next)
    .init({
      ...getOptions(lng, ns),
      resources,
      // Disable any async loading
      initImmediate: false,
    });
  
  return i18nInstance;
};

// const initI18next = async (lng: any, ns: any) => {
//   const i18nInstance = createInstance();
//   await i18nInstance
//     .use(initReactI18next)
//     .use(i18nextBrowserLanguagedetector)
//     .use(
//       resourcesToBackend(
//         (language: any, namespace: any) =>
//           import(`./locales/${language}/${namespace}.json`)
//       )
//     )
//     .init({
//       backend: {
//         loadPath: './locales/{{lng}}/{{ns}}.json' 
//       },
//       cache: {
//         enabled: true,
//         prefix: 'i18n',
//       },
//       detection: {
//         order: ['path', 'cookie', 'navigator'],
//         caches: ['cookie'],
//         lookupFromPathIndex: 0
//       },
//       ...getOptions(lng, ns)
//     });
//     // preload languages
//     // i18next.loadLanguages('en'); 
//     // i18next.loadLanguages('fa');
//   return i18nInstance;
// };

export function getServerTranslation(
  lng: string | undefined,
  ns: string | string[],
  options: { keyPrefix?: string } = {}
) {
  const safeLang = lng ?? 'en'; // fallback if undefined
  const i18nextInstance = initI18next(safeLang, ns);
  const primaryNs = (Array.isArray(ns) ? ns[0] : ns) as any; // cast to Namespace
  
  return {
    t: i18nextInstance.getFixedT(
      safeLang,
      primaryNs,
      options.keyPrefix
    ),
    i18n: i18nextInstance
  };
}