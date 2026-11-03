'use client';

import { createInstance } from 'i18next';
import { initReactI18next } from 'react-i18next';
import resourcesToBackend from 'i18next-resources-to-backend';
import { getOptions } from './setting';

/** A fresh i18next instance per invocation: no global initialized flag or
 * cross-locale namespace cache. Not currently used by production components,
 * but safe if this helper is reintroduced later.
 */
export async function initClientI18n(lng: string, ns: string | string[]) {
  const instance = createInstance();
  await instance
    .use(initReactI18next)
    .use(resourcesToBackend((language: string, namespace: string) =>
      import(`./locales/${language}/${namespace}.json`)
    ))
    .init(getOptions(lng, ns));
  return { i18n: instance, t: instance.getFixedT(lng, ns) };
}
