'use client';
import React from 'react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { JoinOurTeamFormDataType } from '@/types/global';
import Select from '@/components/common/form/Select';
import Input from '@/components/common/form/Input';

interface PersonalInfoSectionProps {
  register: UseFormRegister<JoinOurTeamFormDataType>;
  errors: FieldErrors<JoinOurTeamFormDataType>;
  joinOurTeam: any;
  translations: any;
  unis: any;
  PositionsData: { value: string; label: string }[];
  TypeOfContractWithStudentData: { value: string; label: string }[];
  TypeOfContractWithProfessorData: { value: string; label: string }[];
  TypeOfUnis: { value: string; label: string }[];
  selectPosition: string;
  selectStudentContract: string;
  selectProfessorContract: string;
  selectUni: string;
  handleItemChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  handleContractWithStudentItemChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  handleContractWithProfessorItemChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  handleUniChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

export default function PersonalInfoSection({
  register,
  errors,
  joinOurTeam,
  translations,
  unis,
  PositionsData,
  TypeOfContractWithStudentData,
  TypeOfContractWithProfessorData,
  TypeOfUnis,
  selectPosition,
  selectStudentContract,
  selectProfessorContract,
  selectUni,
  handleItemChange,
  handleContractWithStudentItemChange,
  handleContractWithProfessorItemChange,
  handleUniChange
}: PersonalInfoSectionProps) {
  return (
    <>
      <div className="grid grid-cols-1 gap-6 bg-whiteGold p-4 md:grid-cols-2 lg:grid-cols-3">
        <Select 
          labelClass='' 
          register={register} 
          errors={errors} 
          nameInput="your_position" 
          label={joinOurTeam.PositionPlaceholder} 
          required="" 
          className="select select-bordered mt-4 w-full max-w-xs px-8 " 
          placeholder={joinOurTeam.PositionPlaceholder} 
          options={PositionsData} 
          handleChange={handleItemChange} 
          selected={selectPosition}
        />

        {selectPosition !== joinOurTeam.Professor ? (
          <Select 
            labelClass='' 
            register={register} 
            errors={errors} 
            nameInput="type_of_contract" 
            label={joinOurTeam.contractPlaceholder} 
            required="" 
            className="select select-bordered mt-4 w-full max-w-xs px-8 " 
            placeholder={joinOurTeam.contractPlaceholder} 
            options={TypeOfContractWithStudentData} 
            handleChange={handleContractWithStudentItemChange} 
            selected={selectStudentContract}
          />
        ) : (
          <Select 
            labelClass='' 
            register={register} 
            errors={errors} 
            nameInput="type_of_contract" 
            label={joinOurTeam.contractPlaceholder} 
            required="" 
            className="select select-bordered mt-4 w-full max-w-xs px-8 " 
            placeholder={joinOurTeam.contractPlaceholder} 
            options={TypeOfContractWithProfessorData} 
            handleChange={handleContractWithProfessorItemChange} 
            selected={selectProfessorContract}
          />
        )}

        <Select 
          labelClass='' 
          register={register} 
          errors={errors} 
          nameInput="uni" 
          label={unis.placeholder} 
          required="" 
          className="select select-bordered mt-4 w-full max-w-xs px-8 " 
          placeholder={unis.placeholder} 
          options={TypeOfUnis} 
          handleChange={handleUniChange} 
          selected={selectUni}
        />
      </div>
      {/* next line */}
      <div className="border-b-2 border-black bg-whiteGold">
        <p className="px-5 py-3 text-2xl md:text-3xl">
          {joinOurTeam.formSubtitleTop}
        </p>
      </div>
      <div className="grid grid-cols-1 gap-6 bg-whiteGold p-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="col-span-1">
          <Input
            id="your_first_name"
            register={register}
            errors={errors}
            nameInput="your_first_name"
            type="text"
            label={translations.firstName}
            required={translations.firstNameRequired}
            placeholder={translations.firstNamePlaceholder}
            className="input"
            labelClass=" "
            patternValue=""
            patternMessage=""
          />
        </div>
        <div className="col-span-1">
          <Input
            id="your_last_name"
            register={register}
            errors={errors}
            nameInput="your_last_name"
            type="text"
            label={translations.lastName}
            required={translations.lastNameRequired}
            placeholder={translations.lastNamePlaceholder}
            className="input"
            labelClass=" "
            patternValue=""
            patternMessage=""
          />
        </div>
        <div className="col-span-1">
          <Input
            id="email"
            register={register}
            errors={errors}
            nameInput="email"
            type="text"
            label={joinOurTeam.email}
            required={joinOurTeam.emailRequired}
            patternValue=""
            patternMessage=""
            placeholder={joinOurTeam.emailPlaceholder}
            className="input"
          />
        </div>
        <div className="col-span-1">
          <Input
            id="phone_number"
            register={register}
            errors={errors}
            nameInput="phone_number"
            type="text"
            label={translations.phoneNumber}
            required={translations.phoneNumberRequired}
            patternValue="^[0-9]{11}$"
            patternMessage={translations.phoneNumberErrorMessage}
            placeholder={translations.phoneNumberPlaceholder}
            className="input"
          />
        </div>
      </div>
    </>
  );
}