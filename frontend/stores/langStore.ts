import { create } from 'zustand';
import { CookieValueTypes, getCookie } from 'cookies-next';

type State = {
  lang: string | CookieValueTypes | undefined;
  rendered: boolean;
};

type Action = {
  setLanguage: (language: State["lang"]) => void;
  setRendered: (value: State["rendered"]) => void;
}

export const useLang = create<State & Action>((set) => ({
  lang: getCookie("i18next") ? getCookie("i18next") : "",
  rendered: false,
  setLanguage: (lang) => set(() => ({ lang: lang })),
  setRendered: (value) => set(() => ({rendered: value})),
}));
