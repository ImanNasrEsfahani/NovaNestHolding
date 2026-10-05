'use client';
import React, { useState } from 'react';
import Input from '@/components/common/form/Input';
import Select from '@/components/common/form/Select';
import CountryInput from '@/components/common/form/CountryInput';

type Props = {
  register: any;
  errors: any;
  nameInputs: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    countryOfResidence: string;
    provinceOfResidence: string;
    cityOfResidence: string;
    TypeOfCollaboration: string;
    FieldOfExpert: string;
    FieldOfInterest: string;
  };
  noLabel: boolean;
  translations: {

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
  }
};

export default function PersonalInfoInput({
  register,
  errors,
  nameInputs,
  noLabel,
  translations
}: Props) {

  // track selection for FieldOfExpert to show "other" text input
  const [fieldOfExpertValue, setFieldOfExpertValue] = useState<string>('');
  const [fieldOfInterestValue, setFieldOfInterestValue] = useState<string>('');
  const [showFieldOfExpertOther, setShowFieldOfExpertOther] = useState<boolean>(false);
  const [showFieldOfInterestOther, setShowFieldOfInterestOther] = useState<boolean>(false);

  const handleFieldOfExpertChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = String(e.target.value || '');
    setFieldOfExpertValue(val);
    // show when option equals "other" (case-insensitive) — adjust if your i18n value differs
    setShowFieldOfExpertOther(val.trim().toLowerCase() === 'other');
  };

  const handleFieldOfInterestChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = String(e.target.value || '');
    setFieldOfInterestValue(val);
    // show when option equals "other" (case-insensitive) — adjust if your i18n value differs
    setShowFieldOfInterestOther(val.trim().toLowerCase() === 'other');
  };

  return (
    <>
      {nameInputs?.firstName && (
        <div className="col-span-1 w-full">
          <Input
            id="first_name"
            register={register}
            errors={errors}
            nameInput={nameInputs.firstName}
            type="text"
            required={translations.firstNameRequired}
            patternValue=""
            patternMessage=""
            placeholder={translations.firstNamePlaceholder}
            className="input col-span-1 mb-1 w-full"
            {...(!noLabel ? { label: translations.firstName, labelClass: '' } : {})}
          />
        </div>
      )}

      {nameInputs?.lastName && (
        <div className="col-span-1 w-full">
          <Input
            id="last_name"
            register={register}
            errors={errors}
            nameInput={nameInputs.lastName}
            type="text"
            required={translations.lastNameRequired}
            patternValue=""
            patternMessage=""
            placeholder={translations.lastNamePlaceholder}
            className="input col-span-1 mb-1 w-full"
            {...(!noLabel ? { label: translations.lastName, labelClass: '' } : {})}
          />
        </div>
      )}

      {nameInputs?.email && (
        <div className="col-span-1 w-full">
          <Input
            id="email"
            register={register}
            errors={errors}
            nameInput={nameInputs.email}
            type="email"
            required={translations.emailRequired}
            patternValue="^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$"
            patternMessage={translations.emailErrorMessage}
            placeholder={translations.emailPlaceholder}
            className="input col-span-1 mb-1 w-full"
            {...(!noLabel ? { label: translations.email, labelClass: '' } : {})}
          />
        </div>
      )}

      {nameInputs?.phoneNumber && (
        <div className="col-span-1 w-full">
          <Input
            id="phone_number"
            register={register}
            errors={errors}
            nameInput={nameInputs.phoneNumber}
            type="text"
            required={translations.phoneNumberRequired}
            // patternValue="^\+?[1-9]\d{1,14}$"
            patternValue=""
            patternMessage={translations.phoneNumberErrorMessage}
            placeholder={translations.phoneNumberPlaceholder}
            className="input col-span-1 mb-1 w-full"
            {...(!noLabel ? { label: translations.phoneNumber, labelClass: '' } : {})}
          />
        </div>
      )}

      <CountryInput
        countries={translations.countries}
        countryName={translations.countryName}
        countryNameRequired={translations.countryNameRequired}
        countryNamePlaceholder={translations.countryNamePlaceholder}
        provinceOfResidence={translations.provinceOfResidence}
        provinceOfResidenceRequired={translations.provinceOfResidenceRequired}
        provinceOfResidencePlaceholder={translations.provinceOfResidencePlaceholder}
        cityOfResidence={translations.cityOfResidence}
        cityOfResidenceRequired={translations.cityOfResidenceRequired}
        cityOfResidencePlaceholder={translations.cityOfResidencePlaceholder}

        nameInputs={{
          countryOfResidence: nameInputs.countryOfResidence,
          provinceOfResidence: '',
          cityOfResidence: nameInputs.cityOfResidence
        }}
        errors={errors}
        register={register}
      />

      {nameInputs?.TypeOfCollaboration && (
        <div className="col-span-1 w-full">
          <Select
            register={register}
            errors={errors}
            nameInput={nameInputs.TypeOfCollaboration}
            label={translations.TypeOfCollaboration}
            required={translations.TypeOfCollaborationRequired}
            labelClass=" "
            className="input col-span-1 w-full"
            placeholder={translations.TypeOfCollaborationPlaceholder}
            options={translations.TypeOfCollaborationData}
          />
        </div>
      )}

      {nameInputs?.FieldOfExpert && (
        <div className="col-span-1 w-full">
          <Select
            register={register}
            errors={errors}
            nameInput={nameInputs.FieldOfExpert}
            label={translations.FieldOfExpert}
            required={translations.FieldOfExpertRequired}
            labelClass=" "
            className="input col-span-1 w-full"
            placeholder={translations.FieldOfExpertPlaceholder}
            options={translations.FieldOfExpertData}
            handleChange={handleFieldOfExpertChange}
            selected={fieldOfExpertValue}
          />
        </div>
      )}

      {/* When user selects "Other" show a text input to specify — register under "FieldOfExpertOther" */}
      {showFieldOfExpertOther && (
        <div className="col-span-1 w-full">
          <Input
            id="field_of_expert_other"
            register={register}
            errors={errors}
            nameInput="fieldOfExpertOther"
            type="text"
            label={translations.FieldOfExpertOther}
            required={translations.FieldOfExpertOtherRequired}
            patternValue=""
            patternMessage=""
            placeholder={translations.FieldOfExpertOtherPlaceholder}
            className="input col-span-1 mb-1 w-full"
            labelClass=""
          />
        </div>
      )}

      {nameInputs?.FieldOfInterest && (
        <div className="col-span-1 w-full">
          <Select
            register={register}
            errors={errors}
            nameInput={nameInputs.FieldOfInterest}
            label={translations.FieldOfInterest}
            required={translations.FieldOfInterestRequired}
            labelClass=" "
            className="input col-span-1 w-full"
            placeholder={translations.FieldOfInterestPlaceholder}
            options={translations.FieldOfInterestData}
            handleChange={handleFieldOfInterestChange}
            selected={fieldOfInterestValue}
          />
        </div>
      )}

      {/* When user selects "Other" show a text input to specify — register under "FieldOfExpertOther" */}
      {showFieldOfInterestOther && (
        <div className="col-span-1 w-full">
          <Input
            id="field_of_interest_other"
            register={register}
            errors={errors}
            nameInput="fieldOfInterestOther"
            type="text"
            label={translations.FieldOfInterestOther}
            required={translations.FieldOfInterestOtherRequired}
            patternValue=""
            patternMessage=""
            placeholder={translations.FieldOfInterestOtherPlaceholder}
            className="input col-span-1 mb-1 w-full"
            labelClass=""
          />
        </div>
      )}
    </>
  );
};

