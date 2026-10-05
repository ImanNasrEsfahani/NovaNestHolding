export interface Translations {
  formTitle: string;
  formSubtitle: string;
  resumeFile: string;
  sendButton: string;
  sendingButton: string;

  successMessage: string;
  failedMessage: string;
  choseFile: string;

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

  title: string;
  yesLabel: string;
  noLabel: string;

  birthDate: string;
  birthDateRequired: string;
  birthDateErrorMessage: string;
  birthDateErrorMessageForFutureDate: string;
  birthDateErrorMessageForAge: string;
  birthDatePlaceholder: string;

  EducationLevels: string;
  EducationLevelsRequired: string;
  EducationLevelsErrorMessage: string;
  EducationLevelsPlaceholder: string;

  EducationField: string;
  EducationFieldRequired: string;
  EducationFieldErrorMessage: string;
  EducationFieldPlaceholder: string;

  workHistorySummary: string;
  workHistorySummaryRequired: string;
  workHistorySummaryErrorMessage: string;
  workHistorySummaryPlaceholder: string;

  EducationLevelsData: { value: string; label: string }[];

  formDescription: string[];
}

export interface Props {
  lang: string;
  translations: Translations;
}