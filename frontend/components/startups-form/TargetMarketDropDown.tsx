'use client'
import React from 'react'
import TextArea from '@/components/common/TextArea'
import { FieldErrors, UseFormRegister } from 'react-hook-form'
import { StartupsFormDataType } from '@/types/global'

type Props = {
  register: UseFormRegister<StartupsFormDataType>
  errors: FieldErrors<StartupsFormDataType>
  translations: {
    targetMarket: string
    targetCharacteristics: string
    targetCharacteristicsRequired: string
    targetCharacteristicsPlaceholder: string
    targetCharacteristicsErrorMessage: string

    targetCustomers: string
    targetCustomersRequired: string
    targetCustomersPlaceholder: string
    targetCustomersErrorMessage: string

    targetEstimated: string
    targetEstimatedRequired: string
    targetEstimatedPlaceholder: string
    targetEstimatedErrorMessage: string

    targetTotal: string
    targetTotalRequired: string
    targetTotalPlaceholder: string
    targetTotalErrorMessage: string
  }
}

export default function TargetMarketDropDown({
  register,
  errors,
  translations
}: Props) {

  return (
    <div className='w-full p-2 lg:p-6'>
      <TextArea
        title={translations.targetCharacteristics}
        register={register}
        errors={errors}
        required={translations.targetCharacteristicsRequired}
        nameTextArea={"customerCharacteristic"}
        patternValue={''}
        patternMessage={''}
        placeholder={translations.targetCharacteristicsPlaceholder}
        maxLength={1450}
        maxLengthMessage={translations.targetCharacteristicsErrorMessage}
        validate=""
      />
      <TextArea
        title={translations.targetCustomers}
        register={register}
        errors={errors}
        required={translations.targetCustomersRequired}
        nameTextArea={"currentCustomers"}
        patternValue={''}
        patternMessage={''}
        placeholder={translations.targetCustomersPlaceholder}
        maxLength={1450}
        maxLengthMessage={translations.targetCustomersErrorMessage}
        validate=""
      />
      <TextArea
        title={translations.targetEstimated}
        register={register}
        errors={errors}
        required={translations.targetEstimatedRequired}
        nameTextArea={"estimatedMarketSize"}
        patternValue={''}
        patternMessage={''}
        placeholder={translations.targetEstimatedPlaceholder}
        maxLength={1450}
        maxLengthMessage={translations.targetEstimatedErrorMessage}
        validate=""
      />
    </div>
  )
}