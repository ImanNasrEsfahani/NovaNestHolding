import React, { useEffect } from 'react'
import TextArea from '@/components/common/TextArea'
import { FieldErrors, UseFormRegister, UseFormSetValue } from 'react-hook-form'
import { StartupsFormDataType } from '@/types/global'

type translations = {
  solutionsUniqueValue: string;
  solutionsUniqueValueRequired: string;
  solutionsUniqueValuePlaceholder: string;
  solutionsUniqueValueErrorMessage: string;
  solutionsLevel: string;
  solutionsLevelList: string[];
};

type Props = {
  register: UseFormRegister<StartupsFormDataType>
  errors: FieldErrors<StartupsFormDataType>
  solutionsLevel: number
  handleSolutionsLevelChange: (index: number) => void
  setValue: UseFormSetValue<StartupsFormDataType>
  translations: translations
}

export default function SolutionLevel(props: Props) {
  const {
    register,
    errors,
    solutionsLevel,
    handleSolutionsLevelChange,
    setValue,
    translations
  } = props;

  // ensure RHF knows about the radio field so it's included on submit/validation
  const technologyReadinessLevelRadio = register('technologyReadinessLevel', { required: 'Please select one option' });

  return (
    <div className='w-full p-2 lg:p-6'>
      <TextArea
        title={translations.solutionsUniqueValue}
        register={register}
        errors={errors}
        required={true}
        nameTextArea={"uniqueValueProposition"}
        patternValue={''}
        patternMessage={''}
        placeholder={translations.solutionsUniqueValuePlaceholder}
        maxLength={1450}
        maxLengthMessage={translations.solutionsUniqueValueErrorMessage}
        validate=""
      />
      <fieldset className='w-full mt-4'>
        <legend className='mb-2'>{translations.solutionsLevel}</legend>
        <div className="w-full flex flex-col gap-1 px-4" role="radiogroup" aria-label="Solution level">
          {translations.solutionsLevelList.map((item: string, index: number) => (
            <label
              key={index}
              className="flex items-center gap-3 cursor-pointer p-2 rounded-md hover:bg-gray-50"
            >
              <input
                type="radio"
                className="peer sr-only"
                aria-invalid={errors.technologyReadinessLevel ? "true" : "false"}
                value={item}
                {...technologyReadinessLevelRadio}
                checked={solutionsLevel === index}
                onChange={() => {
                  handleSolutionsLevelChange(index);
                  // update RHF value so it's submitted
                  setValue('technologyReadinessLevel', item, { shouldDirty: true, shouldTouch: true, shouldValidate: true });
                }}
              />

              {/* visual control; reacts to peer-checked */}
              <span className="size-5 aspect-square flex items-center justify-center rounded-full border-2 border-primary transition-colors
                                      peer-checked:bg-primary peer-checked:border-primary">
                <span className={`w-2.5 h-2.5 rounded-full transition-colors ${solutionsLevel === index ? 'bg-white' : 'bg-transparent'}`} />
              </span>

              {/* label text */}
              <span className="text-sm text-gray-800">{item}</span>
            </label>
          ))}
        </div>
      </fieldset>
    </div>
  )
}