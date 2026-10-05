export function birthDateValidatorFactory(
  minAge: number = 14,
  translations: {
    birthDateRequired: string;
    birthDateErrorMessage: string;
    birthDateErrorMessageForFutureDate: string;
    birthDateErrorMessageForAge: string;
  }
) {
  return (value?: string) => {
    if (!value) return translations.birthDateRequired;
    const birth = new Date(value);
    if (Number.isNaN(birth.getTime())) return translations.birthDateErrorMessage;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    birth.setHours(0, 0, 0, 0);
    if (birth > today) return translations.birthDateErrorMessageForFutureDate;
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age >= minAge || translations.birthDateErrorMessageForAge;
  };
}