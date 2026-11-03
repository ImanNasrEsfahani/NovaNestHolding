import { create } from 'zustand';

// Compatibility store for legacy client-only consumers. The active language is
// derived from the route; never read cookies or mutate this store in a Server Component.
type LangState = {
  lang: string;
  rendered: boolean;
  setLanguage: (language: string) => void;
  setRendered: (value: boolean) => void;
};
export const useLang = create<LangState>((set) => ({
  lang: 'en',
  rendered: false,
  setLanguage: (lang) => set({ lang }),
  setRendered: (rendered) => set({ rendered }),
}));
