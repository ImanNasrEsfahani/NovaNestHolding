export const fallbackLng = 'en';
// Only English is publicly available until the Persian translations are complete.
// Keep Persian translation source files and i18next support for future launch.
export const languages = [fallbackLng];
export const defaultNS = 'translation';
export const cookieName = 'i18next';

import type { InitOptions } from 'i18next';

export function getOptions(lng: string, ns?: string | string[]): InitOptions {
  return {
    lng,
    fallbackLng: 'en',
    ns,
    defaultNS: Array.isArray(ns) ? ns[0] : ns || 'common',
    supportedLngs: ['en', 'fa'],
  };
}
