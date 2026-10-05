import React from 'react'
import { FieldErrors, UseFormRegister, UseFormSetValue } from 'react-hook-form'
import { StartupsFormDataType } from '@/types/global'
import { getServerTranslation } from 'app/i18n'

import PitchdeckUpload from '@/components/startups-form/PitchdeckUpload'
import BusinessPlanUpload from '@/components/startups-form/BusinessPlanUpload'
import FinancialAnalysisUpload from '@/components/startups-form/FinancialAnalysisUpload'


type Props = {
    lang: string;
    handleFileCounterChange: (name: string) => void
    handlePitchFileChange: (file: any) => void
    handleBusinessFileChange: (file: any) => void
    handleFinancialFileChange: (file: any) => void
    filesCounter: {
        pitch: boolean;
        business: boolean;
        financial: boolean;
    }
    register: UseFormRegister<StartupsFormDataType>
    errors: FieldErrors<StartupsFormDataType>
    handleSolutionsLevelChange: (index: number) => void
    solutionsLevel: number
    setValue: UseFormSetValue<StartupsFormDataType>
    handleFinancialModelFileChange: (file: any) => void
    required: boolean
    submitCount: number
}

export default function StartUpMvpRefactore({
    lang,
    handleFileCounterChange,
    handlePitchFileChange,
    handleBusinessFileChange,
    handleFinancialFileChange,
    filesCounter,
    register,
    errors,
    solutionsLevel,
    handleSolutionsLevelChange,
    setValue,
    handleFinancialModelFileChange,
    required,
    submitCount
}: Props) {

  const { t } = getServerTranslation(lang, 'formComponent');

  return (
    <div className='mx-auto lg:px-4 flex flex-col mt-6'>
      <p className='text-base leading-loose mt-4 mb-12'>{t('startUp',{ returnObjects: true }).MVP.description}</p>
      <PitchdeckUpload
        problem={true}
        solution={true}
        businessModel={true}
        targetMarket={false}
        property={false}
        chooseFile={t('startUp',{ returnObjects: true }).MVP.choseFile}
        productName={t('startUp',{ returnObjects: true }).MVP.productName}
        productNameRequired={t('startUp',{ returnObjects: true }).MVP.productNameRequired}
        productNamePlaceholder={t('startUp',{ returnObjects: true }).MVP.productNamePlaceholder}
        siteAddress={t('startUp',{ returnObjects: true }).MVP.siteAddress}
        siteAddressRequired={t('startUp',{ returnObjects: true }).MVP.siteAddressRequired}
        siteAddressPlaceholder={t('startUp',{ returnObjects: true }).MVP.siteAddressPlaceholder}
        fileCounter={filesCounter.pitch}
        // onFileCounterChange={handleFileCounterChange}
        onFileChange={handlePitchFileChange}
        register={register}
        errors={errors}
        handleSolutionsLevelChange={handleSolutionsLevelChange}
        solutionsLevel={solutionsLevel}
        setValue={setValue}
        translations={{
          title: t('startUp', { returnObjects: true }).MVP.pitchDeck,
          yesLabel: t('yes'),
          noLabel: t('no'),

          problems: t('startUp', { returnObjects: true }).commons.problems,
          solutionLevel: t('startUp', { returnObjects: true }).commons.solutionLevel,
          businessModel: t('startUp', { returnObjects: true }).commons.businessModel,
          targetMarket: t('startUp', { returnObjects: true }).commons.targetMarketDropDown,
          property: t('startUp', { returnObjects: true }).commons.propertyDropDown
        }}
        required={required}
        prefix="mvp"
        submitCount={submitCount}
      />

      <BusinessPlanUpload
        title={t('startUp',{ returnObjects: true }).MVP.businessPlan}
        yesLabel={t('yes')}
        noLabel={t('no')}
        chooseFile={t('startUp',{ returnObjects: true }).MVP.choseFile}
        onFileChange={handleBusinessFileChange}
        errors={errors}
        required={required}
      />
      
      <FinancialAnalysisUpload
        title={t('startUp',{ returnObjects: true }).MVP.financial}
        yesLabel={t('yes')}
        noLabel={t('no')}
        chooseFile={t('startUp',{ returnObjects: true }).MVP.choseFile}
        onFileChange={handleFinancialFileChange}
        errors={errors}
        required={required}
      />
    </div>
  )
}
