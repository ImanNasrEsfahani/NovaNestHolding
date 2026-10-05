'use client';
import React, { useState } from 'react';
import Select from '@/components/common/form/Select';
import Input from '@/components/common/form/Input';

type Props = {
  register: any;
  errors: any;
  nameInputs?: {
    countryOfResidence: string;
    provinceOfResidence: string;
    cityOfResidence: string;
  };

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
};

export default function CountryInput({
  register,
  errors,
  nameInputs,

  countries,
  countryName,
  countryNameRequired,
  countryNamePlaceholder,

  provinceOfResidence,
  provinceOfResidenceRequired,
  provinceOfResidencePlaceholder,

  cityOfResidence,
  cityOfResidenceRequired,
  cityOfResidencePlaceholder,
}: Props) {
  // Fix: Ensure countries is always an array
  // Add error logging when countries is not an array
  if (!Array.isArray(countries)) {
    console.error('CountryInput Error: Expected countries to be an array, but received:', {
      type: typeof countries,
      value: countries,
      isArray: Array.isArray(countries),
    });
    console.error('CountryInput: Using empty array as fallback. Please check the parent component.');
    console.error('Called from:', new Error().stack);
  }

  const safeCountries = Array.isArray(countries) ? countries : [];
  const countriesData = safeCountries.map((country: string) => ({
    value: country,
    label: country,
  }));

  const [selectedCountry, setSelectedCountry] = useState('');

  const handleCountryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    console.log(event.target.value);
    setSelectedCountry(event.target.value);
  };

  return (
    <>
      {nameInputs?.countryOfResidence && (
        <div className="col-span-1 w-full">
          <Select
            register={register}
            errors={errors}
            nameInput={nameInputs.countryOfResidence}
            label={countryName}
            required={countryNameRequired}
            options={countriesData}
            className="input col-span-1 w-full"
            labelClass="text-gray"
            placeholder={countryNamePlaceholder}
            handleChange={handleCountryChange}
            selected={selectedCountry}
          />
        </div>
      )}

      {nameInputs?.provinceOfResidence && (
        <div className="col-span-1 w-full">
          <Input
            id="province_of_residence"
            register={register}
            errors={errors}
            nameInput={nameInputs.provinceOfResidence}
            type="text"
            label={provinceOfResidence}
            required={provinceOfResidenceRequired}
            patternValue=""
            patternMessage=""
            placeholder={provinceOfResidencePlaceholder}
            className="input col-span-1 mb-1 w-full"
            labelClass=""
          />
        </div>
      )}

      {nameInputs?.cityOfResidence && (
        <div className="col-span-1 w-full">
          <Input
            id="city_of_residence"
            register={register}
            errors={errors}
            nameInput={nameInputs.cityOfResidence}
            type="text"
            label={cityOfResidence}
            required={cityOfResidenceRequired}
            patternValue=""
            patternMessage=""
            placeholder={cityOfResidencePlaceholder}
            className="input col-span-1 mb-1 w-full"
            labelClass=""
          />
        </div>
      )}
    </>
  );
}