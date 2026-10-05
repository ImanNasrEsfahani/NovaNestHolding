export const fallbackLng = 'en'
export const languages = [fallbackLng, 'fa']
export const defaultNS = 'translation'
export const cookieName = 'i18next'

import type { InitOptions } from 'i18next';

export function getOptions(lng: string, ns?: string | string[]): InitOptions {
  return {
    lng,
    fallbackLng: 'en',
    // i18next allows string | string[]
    ns,
    defaultNS: Array.isArray(ns) ? ns[0] : ns || 'common',
    supportedLngs: ['en', 'fa']
  };
}