'use client'
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import fAaboutUs from '@/i18n/locales/fa/aboutUs.json'
import fAacceleration from '@/i18n/locales/fa/acceleration.json'
import fAcardData from '@/i18n/locales/fa/cardData.json'
import fAcontact from '@/i18n/locales/fa/contact.json'
import fAcountryInput from '@/i18n/locales/fa/countryInput.json'
import fAevents from '@/i18n/locales/fa/events.json'
import fAfooter from '@/i18n/locales/fa/footer.json'
import fAformComponent from '@/i18n/locales/fa/formComponent.json'
import fAhandicraft from '@/i18n/locales/fa/handicraft.json'
import fAinvestment from '@/i18n/locales/fa/investment.json'
import fAinvestorForm from '@/i18n/locales/fa/investorForm.json'
import fAlandaGene from '@/i18n/locales/fa/landaGene.json'
import fAlayout from '@/i18n/locales/fa/layout.json'
import fAmagazine from '@/i18n/locales/fa/magazine.json'
import fAmainPage from '@/i18n/locales/fa/mainPage.json'
import fAourTeam from '@/i18n/locales/fa/ourTeam.json'
import fApartnerMemberForm from '@/i18n/locales/fa/partnerMemberForm.json'
import fAstartup from '@/i18n/locales/fa/startUp.json'

import eNaboutUs from '@/i18n/locales/en/aboutUs.json'
import eNacceleration from '@/i18n/locales/en/acceleration.json'
import eNcardData from '@/i18n/locales/en/cardData.json'
import eNcontact from '@/i18n/locales/en/contact.json'
import eNcountryInput from '@/i18n/locales/en/countryInput.json'
import eNevents from '@/i18n/locales/en/events.json'
import eNfooter from '@/i18n/locales/en/footer.json'
import eNformComponent from '@/i18n/locales/en/formComponent.json'
import eNhandicraft from '@/i18n/locales/en/handicraft.json'
import eNinvestment from '@/i18n/locales/en/investment.json'
import eNinvestorForm from '@/i18n/locales/en/investorForm.json'
import eNlandaGene from '@/i18n/locales/en/landaGene.json'
import eNlayout from '@/i18n/locales/en/layout.json'
import eNmagazine from '@/i18n/locales/en/magazine.json'
import eNmainPage from '@/i18n/locales/en/mainPage.json'
import eNourTeam from '@/i18n/locales/en/ourTeam.json'
import eNpartnerMemberForm from '@/i18n/locales/en/partnerMemberForm.json'
import eNstartup from '@/i18n/locales/en/startUp.json'

export const defaultNS = "mainPage";

export const resources = {
  fa: {
    fAaboutUs,
    fAacceleration,
    fAcardData,
    fAcontact,
    fAcountryInput,
    fAevents,
    fAfooter,
    fAformComponent,
    fAhandicraft,
    fAinvestment,
    fAinvestorForm,
    fAlandaGene,
    fAlayout,
    fAmagazine,
    fAmainPage,
    fAourTeam,
    fApartnerMemberForm,
    fAstartup
  },
  en: {
    eNaboutUs,
    eNacceleration,
    eNcardData,
    eNcontact,
    eNcountryInput,
    eNevents,
    eNfooter,
    eNformComponent,
    eNhandicraft,
    eNinvestment,
    eNinvestorForm,
    eNlandaGene,
    eNlayout,
    eNmagazine,
    eNmainPage,
    eNourTeam,
    eNpartnerMemberForm,
    eNstartup
  }
} as const;

i18n.use(initReactI18next).init({
  lng: "fa",
  ns: ["aboutUs", 
    "acceleration", 
    "cardData", 
    "contact", 
    "countryInput", 
    "events",
    "footer",
    "formComponent",
    "handiCraft",
    "investment",
    "investorForm",
    "landaGene",
    "layout",
    "magazine",
    "mainPage",
    "ourTeam",
    "partnerMemberForm",
    "startup"
],
  defaultNS,
  resources,
});