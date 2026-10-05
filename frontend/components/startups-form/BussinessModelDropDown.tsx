'use client';
import React from 'react';
import TextArea from '@/components/common/TextArea';
import { FieldErrors, UseFormRegister } from 'react-hook-form';
import { StartupsFormDataType } from '@/types/global';

type translations = {
  title: string;
  monetization: string;
  monetizationRequired: string;
  monetizationPlaceholder: string;
  monetizationErrorMessage: string;
  delivery: string;
  deliveryRequired: string;
  deliveryPlaceholder: string;
  deliveryErrorMessage: string;
  financial: string;
  choseFile: string;
};

type Props = {
  register: UseFormRegister<StartupsFormDataType>;
  errors: FieldErrors<StartupsFormDataType>
  translations: translations
};

export default function BussinessModelDropDown(props: Props) {
  
  const { register, errors, translations } = props;

  return (
    <div className='w-full p-2 lg:p-6'>
      <TextArea
        title={translations.monetization}
        register={register}
        errors={errors}
        required={true}
        nameTextArea={'monetizationOfYourPlan'}
        patternValue={''}
        patternMessage={''}
        placeholder={translations.monetizationPlaceholder}
        maxLength={1450}
        maxLengthMessage={translations.monetizationErrorMessage}
        validate=""
      />
      <div className="w-full">
        <TextArea
          title={translations.delivery}
          register={register}
          errors={errors}
          required={true}
          nameTextArea={'structureOfYourSales'}
          patternValue={''}
          patternMessage={''}
          placeholder={translations.deliveryPlaceholder}
          maxLength={1450}
          maxLengthMessage={translations.deliveryErrorMessage}
          validate=""
        />
      </div>
    </div>
  );
};
