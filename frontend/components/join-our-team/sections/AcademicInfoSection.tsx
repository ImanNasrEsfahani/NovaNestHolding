'use client';
import React, { useEffect, useRef, useState } from 'react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { JoinOurTeamFormDataType } from '@/types/global';
import Input from '@/components/common/form/Input';
import Select from '@/components/common/form/Select';
import UploadInput from '@/components/common/UploadInput';

interface AcademicInfoSectionProps {
  register: UseFormRegister<JoinOurTeamFormDataType>;
  errors: FieldErrors<JoinOurTeamFormDataType>;
  workWithUS: any;
  langLevelData: any;
  TypeOfSkillLevels: { value: string; label: string }[];
  cvFileRequired: string;
  onCvFileChange: (file: File) => void;
  handleUniChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

export default function AcademicInfoSection({
  register,
  errors,
  workWithUS,
  langLevelData,
  TypeOfSkillLevels,
  cvFileRequired,
  onCvFileChange,
  handleUniChange
}: AcademicInfoSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [professorSelected, setProfessorSelected] = useState(false);

  // Use the actual localized option value, not the English word 'Professor'.
  // Subscribe once to user changes and native resets. There is no effect with
  // missing dependencies and no state update during every React render.
  useEffect(() => {
    const form = sectionRef.current?.closest('form');
    const select = form?.querySelector<HTMLSelectElement>('select[name="your_position"]');
    if (!select) return;
    const update = () => setProfessorSelected(select.value === workWithUS.Professor);
    let resetTimer: number | undefined;
    const onReset = () => {
      // Browser reset applies the new select value after the reset event.
      if (resetTimer !== undefined) window.clearTimeout(resetTimer);
      resetTimer = window.setTimeout(update, 0);
    };
    update();
    select.addEventListener('change', update);
    form?.addEventListener('reset', onReset);
    return () => {
      select.removeEventListener('change', update);
      form?.removeEventListener('reset', onReset);
      if (resetTimer !== undefined) window.clearTimeout(resetTimer);
    };
  }, [workWithUS.Professor]);

  const cvRequired = professorSelected ? (cvFileRequired || workWithUS.cvFileRequired || true) : false;

  return (
    <div ref={sectionRef} className="grid grid-cols-1 gap-6 bg-whiteGold p-4 md:grid-cols-2 lg:grid-cols-3">
      <div className="col-span-1">
        <Input
          id="your_field_of_study"
          register={register}
          errors={errors}
          nameInput="your_field_of_study"
          type="text"
          label={workWithUS.StudyField}
          required={workWithUS.StudyFieldRequired}
          placeholder={workWithUS.StudyFieldPlaceholder}
          className="input"
          labelClass=" "
          patternValue=""
          patternMessage=""
        />
      </div>

      <div className="col-span-1">
        <Input
          id="your_subfield"
          register={register}
          errors={errors}
          nameInput="your_subfield"
          type="text"
          label={workWithUS.StudySubField}
          required={workWithUS.StudySubFieldRequired}
          placeholder={workWithUS.StudySubFieldPlaceholder}
          className="input"
          labelClass=" "
          patternValue=""
          patternMessage=""
        />
      </div>

      <div className="col-span-1 mt-2">
        <UploadInput
          title={workWithUS.cvFile}
          register={register}
          required={cvRequired}
          errors={errors}
          nameInput="cvFile"
          handleChange={onCvFileChange}
        />
      </div>

      <div className='col-span-1'>
        <Select
          labelClass=''
          register={register}
          errors={errors}
          nameInput="langLevel"
          label={langLevelData.placeholder}
          required=""
          className="select select-bordered mt-4 w-full px-8 shadow-sm "
          placeholder={langLevelData.placeholder}
          options={TypeOfSkillLevels}
          handleChange={handleUniChange}
          selected={langLevelData.placeholder}
        />
      </div>
    </div>
  );
}
