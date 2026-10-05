export enum Type {
  MVP = 'MVP',
  FirstSale = 'FirstSale',
  SaleDevelopment = 'SaleDevelopment'
}

interface MentorRegistrationFormClientTranslations {
  formTitle: string;
  formSubtitle: string;
  sendButton: string;
  sendingButton: string;
  successMessage: string;
  failedMessage: string;

  firstName: string;
  firstNameRequired: string;
  firstNamePlaceholder: string;

  lastName: string;
  lastNameRequired: string;
  lastNamePlaceholder: string;

  email: string;
  emailRequired: string;
  emailErrorMessage: string;
  emailPlaceholder: string;

  phoneNumber: string;
  phoneNumberRequired: string;
  phoneNumberErrorMessage: string;
  phoneNumberPlaceholder: string;

  countries: string[];
  countryName: string;
  countryNameRequired: string;
  countryNamePlaceholder: string;

  provinceOfResidence: string;
  provinceOfResidenceRequired: string;
  provinceOfResidencePlaceholder: string;

  cityOfResidence: string;
  cityOfResidenceRequired: string;
  cityOfResidencePlaceholder: string;

  TypeOfCollaboration: string;
  TypeOfCollaborationRequired: string;
  TypeOfCollaborationPlaceholder: string;
  TypeOfCollaborationData: { value: string; label: string }[];

  FieldOfExpert: string;
  FieldOfExpertRequired: string;
  FieldOfExpertPlaceholder: string;
  FieldOfExpertData: { value: string; label: string }[];

  FieldOfExpertOther: string;
  FieldOfExpertOtherRequired: string;
  FieldOfExpertOtherPlaceholder: string;

  FieldOfInterest: string;
  FieldOfInterestRequired: string;
  FieldOfInterestPlaceholder: string;
  FieldOfInterestData: { value: string; label: string }[];

  FieldOfInterestOther: string;
  FieldOfInterestOtherRequired: string;
  FieldOfInterestOtherPlaceholder: string;

  birthDate: string;
  birthDateRequired: string;
  birthDateErrorMessage: string;
  birthDateErrorMessageForFutureDate: string;
  birthDateErrorMessageForAge: string;
  birthDatePlaceholder: string;

  website: string;
  websiteRequired: string;
  websitePlaceholder: string;
  websiteErrorMessage: string;

  linkedin: string;
  linkedinRequired: string;
  linkedinPlaceholder: string;
  linkedinErrorMessage: string;

  instagram: string;
  instagramRequired: string;
  instagramPlaceholder: string;
  instagramErrorMessage: string;

  ExpertiesAreas: string;
  ExpertiesAreasPlaceholder: string;
  ExpertiesAreasRequired: string;
  ExpertiesAreasErrorMessage: string;

  howDidYouKnowUs: string;
  howDidYouKnowUsPlaceholder: string;
  howDidYouKnowUsRequired: string;
  howDidYouKnowUsErrorMessage: string;

  formDescription: string[];

  submitionMessage: {
    title: string;
    description: string[];
    buttonText: string;
  };
}

interface MagazineData {
  title: string;
  description: string | TrustedHTML;
  thumbnail: string;
  slug: string;
  date: string;
  file: string;
}

interface Person {
  image: string;
  position: string;
  name: string;
  linkedIn: string;
  text: string;
  slug: string;
  first_name: string;
  last_name: string;
  websites: any[];
  job_title: string;
  instagram: string;
  email: string;
  linkedin: string;
  whatsapp: string;
  thumbnail: string;
  location: string;
  skills: string[];
  interests: string[];
  education: string;
  about: string[];
};

// Define an interface for contact form in each profile page
interface ContactProfileFormDataType {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  subject: string;
  message: string;
}

// Define an interface for contact form data
interface ContactFormDataType {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  message: string;
}

// Define an interface for SmallReservationForm form data
interface SmallReservationFormDataType {
  name: string;
  email: string;
  number: string;
}

// Define an interface for investor registration form data
interface InvestorRegistrationFormDataType {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  countryOfResidence: string;
  investmentCeiling: string;
  preferredAreas: string;
  howDidYouKnowUs: string;
}

// Define an interface for mentor registration form data
interface MentorRegistrationFormDataType {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  birthDate?: Date;
  countryOfResidence: string;
  cityOfResidence: string;
  website: string;
  linkedin: string;
  instagram: string;
  ExpertiesAreas: string;
  howDidYouKnowUs: string;
}

interface JoinOurTeamFormDataType {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  countryOfResidence: string,
  cityOfResidence: string,
  typeOfCollaboration: string,
  fieldOfExpert: string,
  fieldOfExpertOther: string,
  birthDate: Date,
  educationLevel: string,
  educationField: string,
  workHistorySummary: string,
  cvFile: File | string | null;
}

// Define an interface for partner membership form data
interface JoinAsaPartnerFormDataType {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  countryOfResidence: string;
  cityOfResidence: string;
  companyName: string;
  website: string;
  linkedin: string;
  briefIntroduction: string;
  howDidYouKnowUs: string;
}

// Define an interface for job application form data
interface JoinOurTeamFormDataType {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  countryOfResidence: string;
  cityOfResidence: string;
  typeOfCollaboration: string;
  fieldOfExpert: string;
  fieldOfExpertOther: string;
  birthDate?: Date;
  educationField?: string;
  educationLevel?: string;
  workHistorySummary?: string;
  cvFile?: File | '' | null | undefined;
}

// Define an interface for job application form data
interface TraineeRegistrationFormDataType {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  countryOfResidence: string;
  cityOfResidence: string;
  birthDate: Date;
  fieldOfExpert: string;
  fieldOfExpertOther: string;
  tellUsAboutYourself: string;
  cvFile?: File | '' | null | undefined;
}

// Define an interface for startups form data
interface StartupsFormDataType {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  countryOfResidence: string;
  cityOfResidence: string;

  // MVP or Early Traction or Scale-Up
  startupType: Type;

  // with Pitchdeck file
  pitchDeckFile?: File | '';

  // General Information without pitchdeck file
  productName: string;
  siteAddress: string;

  // Problem accordion
  customerProblem: string;

  // Solution accordion
  uniqueValueProposition: string;
  technologyReadinessLevel: string;
  
  // business model accordion
  monetizationOfYourPlan: string;
  structureOfYourSales: string;
  
  // Target Market accordion
  customerCharacteristic: string;
  currentCustomers: string;
  estimatedMarketSize: string;

  // Property accordion
  startupRevenue: string;
  monthlyIncome: string;
  currentInterestRate: string;
  currentRaisedFunding: string;
  neededCapital: string;

  // other files
  businessPlanFile?: File | '';
  financialFile?: File | '';

  // last questions
  cooperatedWithInvestors: string;
  howDidYouKnowUs: string;
}

interface DecodedToken {
  exp: number;
  iat: number;
  role: string;
  user_id: number;
  first_name: string;
  last_name: string;
  image: string;
  jwt: string;
}

interface imageList {
  src: string;
  alt: string;
}

interface CompanySectionsInterface {
  smallTitle: string;
  title: string;
  text: string;
  reverse: boolean;
  show: boolean;
  index: number;
  link: string;
  addedClass: string;
  images: imageList[];
  buttonText: string;
}

interface SportsInterface {
  title: string;
  image: string;
  type: string;
  date: string;
}

interface LogosInterface {
  number: number;
  alt: string;
}

interface ImagesInterface {
  src: string;
}

interface LinksInterface {
  linkedin: string;
  whatsapp: string;
  email: string;
  website: string;
  instagram: string;
}

export {
  MentorRegistrationFormClientTranslations,
  Person,
  MagazineData,
  ContactProfileFormDataType,
  ContactFormDataType,
  SmallReservationFormDataType,
  CompanySectionsInterface,
  ImagesInterface,
  SportsInterface,
  LogosInterface,
  StartupsFormDataType,
  JoinAsaPartnerFormDataType,
  InvestorRegistrationFormDataType,
  MentorRegistrationFormDataType,
  JoinOurTeamFormDataType,
  TraineeRegistrationFormDataType,
  DecodedToken,
  JoinOurTeamFormDataType,
};