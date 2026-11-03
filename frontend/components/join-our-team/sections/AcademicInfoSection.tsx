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

  // The parent uses the literal English string "Professor" when setting its
  // CV-required flag. The <select> stores localized labels, so the old rule
  // failed for «استاد دانشگاه». Observe this form's own position select and
  // compare against the current translation, without changing submitted data.
  useEffect(() => {
    const select = sectionRef.current?.closest('form')
      ?.querySelector<HTMLSelectElement>('select[name="your_position"]');
    if (!select) return;
    const update = () => setProfessorSelected(select.value === workWithUS.Professor);
    update();
    select.addEventListener('change', update);
    return () => select.removeEventListener('change', update);
  }, [workWithUS.Professor]);

  // A successful submission resets react-hook-form without necessarily firing a
  // native change event. Keep the requirement synced with that reset as well.
  useEffect(() => {
    const select = sectionRef.current?.closest('form')
      ?.querySelector<HTMLSelectElement>('select[name="your_position"]');
    if (select) setProfessorSelected(select.value === workWithUS.Professor);
  });

  // Clear the parent's stale English-only required flag when Student is chosen.
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
