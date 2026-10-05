import React from 'react';
import { FieldErrors, UseFormRegister } from 'react-hook-form';
import { StartupsFormDataType } from '@/types/global';
import TextArea from '@/components/common/TextArea';

type Props = {
  textAreaTitle: string;
  textAreaRequired: string;
  textAreaPlaceholder: string;
  textAreaErrorMessage: string;
  register: UseFormRegister<StartupsFormDataType>;
  errors: FieldErrors<StartupsFormDataType>;
  nameTextArea?: string;
};

export default function ProblemsSection({
  textAreaTitle,
  textAreaRequired,
  textAreaPlaceholder,
  textAreaErrorMessage,
  register,
  errors,
  nameTextArea = 'customerProblem'
}: Props) {

  return (
    <>
      <div className="w-full p-2 lg:p-6">
        <TextArea
          title={textAreaTitle}
          register={register}
          errors={errors}
          required={textAreaRequired}
          nameTextArea={nameTextArea}
          patternValue={''}
          patternMessage={''}
          placeholder={textAreaPlaceholder}
          maxLength={1450}
          maxLengthMessage={textAreaErrorMessage}
          validate=""
        />
      </div>
    </>
  );
}