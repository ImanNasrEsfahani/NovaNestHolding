import React from 'react'
import { StartupsFormDataType } from '@/types/global'
import { UseFormRegister, FieldErrors, UseFormSetValue } from 'react-hook-form'
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

export default function StartUpSaleDevelopRefactore({
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
    <div className='mx-auto lg:px-4 flex flex-col'>
      <p className='text-base leading-loose mt-4 mb-12'>{t('startUp',{ returnObjects: true }).SaleDevelopment.description}</p>

      <PitchdeckUpload
        problem={true}
        solution={true}
        businessModel={true}
        targetMarket={true}
        property={true}
        chooseFile={t('startUp',{ returnObjects: true }).SaleDevelopment.choseFile}
        productName={t('startUp',{ returnObjects: true }).SaleDevelopment.productName}
        productNameRequired={t('startUp',{ returnObjects: true }).SaleDevelopment.productNameRequired}
        productNamePlaceholder={t('startUp',{ returnObjects: true }).SaleDevelopment.productNamePlaceholder}
        siteAddress={t('startUp',{ returnObjects: true }).SaleDevelopment.siteAddress}
        siteAddressRequired={t('startUp',{ returnObjects: true }).SaleDevelopment.siteAddressRequired}
        siteAddressPlaceholder={t('startUp',{ returnObjects: true }).SaleDevelopment.siteAddressPlaceholder}
        fileCounter={filesCounter.pitch}
        onFileChange={handlePitchFileChange}
        register={register}
        errors={errors}
        handleSolutionsLevelChange={handleSolutionsLevelChange}
        solutionsLevel={solutionsLevel}
        setValue={setValue}
        translations={{
          title: t('startUp', { returnObjects: true }).FirstSale.pitchDeck,
          yesLabel: t('yes'),
          noLabel: t('no'),

          problems: t('startUp', { returnObjects: true }).commons.problems,
          solutionLevel: t('startUp', { returnObjects: true }).commons.solutionLevel,
          businessModel: t('startUp', { returnObjects: true }).commons.businessModel,
          targetMarket: t('startUp', { returnObjects: true }).commons.targetMarketDropDown,
          property: t('startUp', { returnObjects: true }).commons.propertyDropDown
        }}
        required={required}
        prefix='scaleup'
        submitCount={submitCount}
      />
      
      <BusinessPlanUpload
        title={t('startUp',{ returnObjects: true }).SaleDevelopment.businessPlan}
        yesLabel={t('yes')}
        noLabel={t('no')}
        chooseFile={t('startUp',{ returnObjects: true }).SaleDevelopment.choseFile}
        onFileChange={handleBusinessFileChange}
        errors={errors}
        required={required}
      />
      
      <FinancialAnalysisUpload
        title={t('startUp',{ returnObjects: true }).SaleDevelopment.financial}
        yesLabel={t('yes')}
        noLabel={t('no')}
        chooseFile={t('startUp',{ returnObjects: true }).SaleDevelopment.choseFile}
        onFileChange={handleFinancialFileChange}
        errors={errors}
        required={required}
      />
    </div>
  )
}