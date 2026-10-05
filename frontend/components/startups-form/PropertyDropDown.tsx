import React, { useState } from 'react'
import TextArea from '@/components/common/TextArea';
import { StartupsFormDataType } from '@/types/global';
import { FieldErrors, UseFormRegister } from 'react-hook-form';

type PropertyTranslations = {
  property: string;
  propertyRevenue: string;
  propertyRevenueRequired: string;
  propertyRevenuePlaceholder: string;
  propertyRevenueErrorMessage: string;
  propertyMonthly: string;
  propertyMonthlyRequired: string;
  propertyMonthlyPlaceholder: string;
  propertyMonthlyErrorMessage: string;
  propertyRate: string;
  propertyRateRequired: string;
  propertyRatePlaceholder: string;
  propertyRateErrorMessage: string;
  propertyBusiness: string;
  propertyBusinessRequired: string;
  propertyBusinessPlaceholder: string;
  propertyBusinessErrorMessage: string;
  propertyCapital: string;
  propertyCapitalRequired: string;
  propertyCapitalPlaceholder: string;
  propertyCapitalErrorMessage: string;
}

type Props = {
  register: UseFormRegister<StartupsFormDataType>
  errors: FieldErrors<StartupsFormDataType>
  translations: PropertyTranslations
}

export default function PropertyDropDown({ register, errors, translations }: Props) {

  return (
    <div className='w-full p-2 lg:p-6'>
      <TextArea
        title={translations.propertyRevenue}
        register={register}
        errors={errors}
        required={translations.propertyRevenueRequired}
        nameTextArea={"startupRevenue"}
        patternValue={''}
        patternMessage={''}
        placeholder={translations.propertyRevenuePlaceholder}
        maxLength={1450}
        maxLengthMessage={translations.propertyRevenueErrorMessage}
        validate=""
      />
      <TextArea
        title={translations.propertyMonthly}
        register={register}
        errors={errors}
        required={translations.propertyMonthlyRequired}
        nameTextArea={"monthlyIncome"}
        patternValue={''}
        patternMessage={''}
        placeholder={translations.propertyMonthlyPlaceholder}
        maxLength={1450}
        maxLengthMessage={translations.propertyMonthlyErrorMessage}
        validate=""
      />
      <TextArea
        title={translations.propertyRate}
        register={register}
        errors={errors}
        required={translations.propertyRateRequired}
        nameTextArea={"currentInterestRate"}
        patternValue={''}
        patternMessage={''}
        placeholder={translations.propertyRatePlaceholder}
        maxLength={1450}
        maxLengthMessage={translations.propertyRateErrorMessage}
        validate=""
      />
      <TextArea
        title={translations.propertyBusiness}
        register={register}
        errors={errors}
        required={translations.propertyBusinessRequired}
        nameTextArea={"currentRaisedFunding"}
        patternValue={''}
        patternMessage={''}
        placeholder={translations.propertyBusinessPlaceholder}
        maxLength={1450}
        maxLengthMessage={translations.propertyBusinessErrorMessage}
        validate=""
      />
      <TextArea
        title={translations.propertyCapital}
        register={register}
        errors={errors}
        required={translations.propertyCapitalRequired}
        nameTextArea={"neededCapital"}
        patternValue={''}
        patternMessage={''}
        placeholder={translations.propertyCapitalPlaceholder}
        maxLength={1450}
        maxLengthMessage={translations.propertyCapitalErrorMessage}
        validate=""
      />
    </div>
  )
}