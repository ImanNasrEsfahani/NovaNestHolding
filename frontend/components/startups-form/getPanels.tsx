import React from 'react';
import ProblemsSection from './ProblemSection';
import SolutionLevel from './SolutionLevel';
import BussinessModelDropDown from './BussinessModelDropDown';
import TargetMarketDropDown from './TargetMarketDropDown';
import PropertyDropDown from './PropertyDropDown';
import { StartupsFormDataType } from '@/types/global';
import type { UseFormRegister } from 'react-hook-form';

type Props = {
  problem: boolean;
  solution: boolean;
  businessModel: boolean;
  targetMarket: boolean;
  property: boolean;
  register: UseFormRegister<StartupsFormDataType>;
  errors: any;
  handleSolutionsLevelChange: (v: any) => void;
  solutionsLevel: any;
  setValue: any;
  translations: any;
  prefix?: string;
};

export function getPanels(props: Props) {
  const {
    problem, solution, businessModel, targetMarket, property,
    register, errors, handleSolutionsLevelChange, solutionsLevel, setValue,
    translations, prefix
  } = props;

  const panels = [
    {
      id: 'problems',
      title: translations.problems.title,
      show: problem,
      fields: ['customerProblem'],
      content: (
        <ProblemsSection
          textAreaTitle={translations.problems.customerProblem}
          textAreaRequired={translations.problems.customerProblemRequired}
          textAreaPlaceholder={translations.problems.customerProblemPlaceholder}
          textAreaErrorMessage={translations.problems.customerProblemErrorMessage}
          register={register}
          errors={errors}
        />
      )
    },
    {
      id: 'solution',
      title: translations.solutionLevel.title,
      show: solution,
      fields: ['uniqueValueProposition', 'solutionsLevel'],
      content: (
        <SolutionLevel
          handleSolutionsLevelChange={handleSolutionsLevelChange}
          solutionsLevel={solutionsLevel}
          register={register}
          errors={errors}
          setValue={setValue}
          translations={{
            solutionsUniqueValue: translations.solutionLevel.solutionsUniqueValue,
            solutionsUniqueValueRequired: translations.solutionLevel.solutionsUniqueValueRequired,
            solutionsUniqueValuePlaceholder: translations.solutionLevel.solutionsUniqueValuePlaceholder,
            solutionsUniqueValueErrorMessage: translations.solutionLevel.solutionsUniqueValueErrorMessage,
            solutionsLevel: translations.solutionLevel.solutionsLevel,
            solutionsLevelList: translations.solutionLevel.solutionsLevelList,
          }}
        />
      )
    },
    {
      id: 'businessModel',
      title: translations.businessModel.title,
      show: businessModel,
      fields: ['monetizationOfYourPlan', 'structureOfYourSales'],
      content: (
        <BussinessModelDropDown
          register={register}
          errors={errors}
          translations={translations.businessModel}
        />
      )
    },
    {
      id: 'targetMarket',
      title: translations.targetMarket.targetMarket,
      show: targetMarket,
      fields: ['customerCharacteristic', 'currentCustomers', 'estimatedMarketSize'],
      content: (
        <TargetMarketDropDown
          register={register}
          errors={errors}
          translations={translations.targetMarket}
        />
      )
    },
    {
      id: 'property',
      title: translations.property.property,
      show: property,
      fields: ['startupRevenue', 'monthlyIncome', 'currentRaisedFunding', 'neededCapital'],
      content: (
        <PropertyDropDown
          register={register}
          errors={errors}
          translations={translations.property}
        />
      )
    }
  ];

  return panels;
}