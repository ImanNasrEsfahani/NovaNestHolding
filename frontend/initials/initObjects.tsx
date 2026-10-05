import {
  StartupsFormDataType,
  JoinOurTeamFormDataType,
  JoinAsaPartnerFormDataType,
  TraineeRegistrationFormDataType,
  InvestorRegistrationFormDataType,
  MentorRegistrationFormDataType,
  ContactProfileFormDataType,
  ContactFormDataType,
  SmallReservationFormDataType,
} from '@/types/global';

enum Type {
  MVP = 'MVP',
  FirstSale = 'FirstSale',
  SaleDevelopment = 'SaleDevelopment'
}

const initialStartupsFormData: StartupsFormDataType = {
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: '',
  countryOfResidence: '',
  cityOfResidence: '',

  // MVP or Early Traction or Scale-Up
  startupType: Type.MVP,

  // with Pitchdeck file
  pitchDeckFile: '',

  // General Information without pitchdeck file
  productName: '',
  siteAddress: '',

  // Problem accordion
  customerProblem: '',

  // Solution accordion
  uniqueValueProposition: '',
  technologyReadinessLevel: '',
  
  // business model accordion
  monetizationOfYourPlan: '',
  structureOfYourSales: '',
  
  // Target Market accordion
  customerCharacteristic: '',
  currentCustomers: '',
  estimatedMarketSize: '',

  // Property accordion
  startupRevenue: '',
  monthlyIncome: '',
  currentInterestRate: '',
  currentRaisedFunding: '',
  neededCapital: '',

  // other files
  businessPlanFile: '',
  financialFile: '',

  // last questions
  cooperatedWithInvestors: '',
  howDidYouKnowUs: ''
};

const initialJoinAsaPartnerFormData: JoinAsaPartnerFormDataType = {
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: '',
  countryOfResidence: '',
  cityOfResidence: '',
  companyName: '',
  website: '',
  linkedin: '',
  briefIntroduction: '',
  howDidYouKnowUs: '',
};

const initialJoinOurTeamFormData: JoinOurTeamFormDataType = {
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: '',
  countryOfResidence: '',
  cityOfResidence: '',
  typeOfCollaboration: '',
  fieldOfExpert: '',
  fieldOfExpertOther: '',
  birthDate: new Date(),
  educationLevel: '',
  educationField: '',
  workHistorySummary: '',
  cvFile: null
};

const initialInvestorRegistrationFormData: InvestorRegistrationFormDataType = {
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: '',
  countryOfResidence: '',
  investmentCeiling: '',
  preferredAreas: '',
  howDidYouKnowUs: '',
};

const initialMentorRegistrationFormData: MentorRegistrationFormDataType = {
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: '',
  countryOfResidence: '',
  cityOfResidence: '',
  birthDate: new Date(),
  website: '',
  linkedin: '',
  instagram: '',
  ExpertiesAreas: '',
  howDidYouKnowUs: '',
};

const initialTraineeRegistrationFormData: TraineeRegistrationFormDataType = {
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: '',
  countryOfResidence: '',
  cityOfResidence: '',
  birthDate: new Date(),
  fieldOfExpert: '',
  fieldOfExpertOther: '',
  tellUsAboutYourself: ''
};

const initialContactProfileFormData: ContactProfileFormDataType = {
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: '',
  subject: '',
  message: ''
};

const initialContactFormData: ContactFormDataType = {
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: '',
  message: ''
};

const initialSmallReservationFormData: SmallReservationFormDataType = {
  name: '',
  email: '',
  number: '',
};

export {
  initialStartupsFormData,
  initialJoinAsaPartnerFormData,
  initialInvestorRegistrationFormData,
  initialMentorRegistrationFormData,
  initialTraineeRegistrationFormData,
  initialJoinOurTeamFormData,
  initialContactProfileFormData,
  initialContactFormData,
  initialSmallReservationFormData
};
