'use client';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { JoinOurTeamFormDataType } from '@/types/global';
import { UnifiedFormStatus } from '@/components/common/form/UnifiedFormSubmit';
import GetCsrfToken from '@/utils/get-csrf-token';
import { initialJoinOurTeamFormData } from '../../initials/initObjects';
import { submitWorkWithUsForm } from 'pages/api/work-with-us';
import { useSubmit } from 'stores/dataStore';
import { useFile } from 'stores/fileStore';
import Image from 'next/image';
import PersonalInfoSection from '@/components/join-our-team/sections/PersonalInfoSection';
import AcademicInfoSection from '@/components/join-our-team/sections/AcademicInfoSection';
import ButtonRefactor from '@/components/common/ButtonRefactor';

interface Translations {

  joinOurTeam: {
    Professor: string;
    student: string;
    hiring: string;
    Internship: string;
    UniversityInternship: string;
    professionalConsultation: string;
    formTitle: string;
    PositionPlaceholder: string;
    contractPlaceholder: string;
    cvFileRequired: string;

    formSubtitleTop: string;
    formSubtitleBottom: string;

    email: string;
    emailRequired: string;
    emailPlaceholder: string;

    StudyField: string;
    StudyFieldRequired: string;
    StudyFieldPlaceholder: string;
    StudySubField: string;
    StudySubFieldRequired: string;
    StudySubFieldPlaceholder: string;

    cvFile: string;
  };

  universities: {
    unis: Record<string, string>;
    placeholder: string;
  };

  langLevel: {
    levels: Record<string, string>;
    placeholder: string;
  };

  firstName: string;
  firstNameRequired: string;
  firstNamePlaceholder: string;

  lastName: string;
  lastNameRequired: string;
  lastNamePlaceholder: string;

  phoneNumber: string;
  phoneNumberRequired: string;
  phoneNumberPlaceholder: string;
  phoneNumberErrorMessage: string;

  sendButton: string;
  sendingButton: string;
  successMessage: string;
  failedMessage: string;
}

interface JoinOurTeamClientProps {
  translations: Translations;
  lang: string;
}

export default function JoinOurTeamClient({ translations, lang }: JoinOurTeamClientProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<JoinOurTeamFormDataType>({
    mode: 'onBlur',
    defaultValues: initialJoinOurTeamFormData
  });

  const { joinOurTeam, universities, langLevel } = translations;
  const { send } = useSubmit();
  const [submissionResult, setSubmissionResult] = useState<{ status: 'success' | 'pending' | 'error'; message: string } | null>(null);


  const Positions = {
    Professor: joinOurTeam.Professor,
    Student: joinOurTeam.student
  } as const;

  const { cvFileState, handleCvFileChange } = useFile((s) => s);

  // Adapter: UploadInput expects (file: File) => void
  const onCvFileChange = (file: File) => {
    handleCvFileChange({ cvFile: file });
  };

  const PositionsItem = [Positions.Professor, Positions.Student];

  const PositionsData = PositionsItem.map((type: any) => ({
    value: type,
    label: type
  }));

  const [selectPosition, setSelectPosition] = useState('');

  const [cvFileRequired, setCvFileRequired] = useState('');

  const handleItemChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectPosition(event.target.value);
    if (event.target.value == 'Professor') {
      setCvFileRequired(joinOurTeam.cvFileRequired);
    }
  };

  const handleUniChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectUni(event.target.value);
  };

  const TypeOfContractWithStudent = {
    Hiring: joinOurTeam.hiring,
    Internship: joinOurTeam.Internship,
    UniversityInternship: joinOurTeam.UniversityInternship
  } as const;

  const TypeOfContractWithProfessor = {
    Consultation: joinOurTeam.professionalConsultation
  } as const;

  const unis = universities;
  const langLevelData = langLevel;

  const unisList: any[] = []
  const skillLevels: any[] = []

  Object.entries(unis.unis).forEach(([value]) => {
    unisList.push(value);
  })

  Object.entries(langLevelData.levels).forEach(([value]) => {
    skillLevels.push(value);
  })

  const TypeOfUnis = unisList.map(
    (type: any) => ({
      value: type,
      label: type
    })
  )

  const TypeOfSkillLevels = skillLevels.map(
    (type: any) => ({
      value: type,
      label: type
    })
  )

  const TypeOfContractWithStudentItem = [
    TypeOfContractWithStudent.Hiring,
    TypeOfContractWithStudent.Internship,
    TypeOfContractWithStudent.UniversityInternship
  ];

  const TypeOfContractWithProfessorItem = [
    TypeOfContractWithProfessor.Consultation
  ];

  const TypeOfContractWithStudentData = TypeOfContractWithStudentItem.map(
    (type: any) => ({
      value: type,
      label: type
    })
  );

  const TypeOfContractWithProfessorData = TypeOfContractWithProfessorItem.map(
    (type: any) => ({
      value: type,
      label: type
    })
  );

  const [selectStudentContract, setSelectStudentContract] = useState('');
  const [selectProfessorContract, setSelectProfessorContract] = useState('');
  const [selectUni, setSelectUni] = useState(unis.placeholder);

  const handleContractWithStudentItemChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectStudentContract(event.target.value);
  };

  const handleContractWithProfessorItemChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectProfessorContract(event.target.value);
  };

  const { csrfToken, handleTokenChange, handleSubmitingChange, handleSendChange, handleNotifChange, handleSuccessChange
  } = useSubmit();

  useEffect(() => {
    async function fetchCsrfToken() {
      const token = await GetCsrfToken(
        `${process.env.NEXT_PUBLIC_DJANGO_HOST_URL}/get-csrf-token`
      );
      handleTokenChange(token);
    }
    fetchCsrfToken();
  }, [handleTokenChange]);

  const onSubmit = async (formData: JoinOurTeamFormDataType) => {
    setSubmissionResult(null);
    handleSendChange(true);
    const sendFormData = new FormData();
    if (cvFileState.cvFile instanceof File) {
      sendFormData.append('cvFile', cvFileState.cvFile, cvFileState.cvFile.name);
    }
    Object.entries(formData).forEach(([fieldName, fieldValue]) => {
      if (fieldName === 'cvFile' || fieldValue === null || fieldValue === undefined) return;
      if (fieldName === 'birthDate' && fieldValue instanceof Date) {
        const y = fieldValue.getFullYear();
        const m = String(fieldValue.getMonth() + 1).padStart(2, '0');
        const d = String(fieldValue.getDate()).padStart(2, '0');
        sendFormData.append(fieldName, `${y}-${m}-${d}`);
      } else if (typeof fieldValue !== 'object') {
        sendFormData.append(fieldName, String(fieldValue));
      }
    });

    try {
      const response = await submitWorkWithUsForm(sendFormData, csrfToken);
      const reference = response.data?.reference;
      if ((response.status !== 201 && response.status !== 202) ||
          !Number.isInteger(reference) || reference <= 0) {
        throw new Error('Server did not confirm the saved submission');
      }
      // Only a verified database reference permits clearing the form.
      reset(initialJoinOurTeamFormData);
      handleCvFileChange({ cvFile: null });
      setSelectPosition('');
      setSelectStudentContract('');
      setSelectProfessorContract('');
      if (response.status === 202 || response.data.notifications_sent !== true) {
        setSubmissionResult({
          status: 'pending',
          message: lang === 'fa'
            ? `درخواست شما با شماره پیگیری #${reference} ذخیره شد، اما برخی اعلان‌های ایمیلی در انتظارند. لطفاً دوباره ثبت نکنید.`
            : `Your submission was saved (#${reference}), but some email notifications are pending. Please do not submit again.`,
        });
      } else {
        setSubmissionResult({ status: 'success', message: `${translations.successMessage} (#${reference})` });
      }

    } catch (error) {
      // Network, authentication and validation failures must NEVER erase entries.
      // Preserve any CV already selected in the upload component/state.
      setSubmissionResult({ status: 'error', message: translations.failedMessage });

      console.error('Work With Us submission failed', error);
    } finally {
      handleSendChange(false);
    }
  };

  const errorsList = Object.entries(errors).map(([name, value]) => ({
    name: name,
    value: value
  }));

  return (
    <>
      <div className="container -m-4 mx-auto my-20 gap-y-0 px-5 font-barlow lg:p-20 flex flex-col items-center">
        <div className='flex flex-col md:flex-row gap-6'>
          <div className='flex justify-center relative size-[200px] mt-6'>
            <Image src="/static/images/work-with-us/forough-logo.png" alt="Work with us" layout='fill' className='object-cover' />
          </div>
          <div className='flex justify-center relative w-[200px] h-[210px]'>
            <Image src="/static/images/work-with-us/farazaman-logo.png" alt="Work with us" layout='fill' className='object-cover' />
          </div>
        </div>
        <div className="py-10">
          <h3 className="text-center text-2xl md:text-3xl">
            {joinOurTeam.formTitle}
          </h3>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="w-full">
          <PersonalInfoSection
            register={register}
            errors={errors}
            joinOurTeam={joinOurTeam}
            translations={translations}
            unis={unis}
            PositionsData={PositionsData}
            TypeOfContractWithStudentData={TypeOfContractWithStudentData}
            TypeOfContractWithProfessorData={TypeOfContractWithProfessorData}
            TypeOfUnis={TypeOfUnis}
            selectPosition={selectPosition}
            selectStudentContract={selectStudentContract}
            selectProfessorContract={selectProfessorContract}
            selectUni={selectUni}
            handleItemChange={handleItemChange}
            handleContractWithStudentItemChange={handleContractWithStudentItemChange}
            handleContractWithProfessorItemChange={handleContractWithProfessorItemChange}
            handleUniChange={handleUniChange}
          />
          {/* next line */}
          <div className="border-b-2 border-black bg-whiteGold">
            <p className="px-5 py-3 text-2xl md:text-3xl">
              {joinOurTeam.formSubtitleBottom}
            </p>
          </div>
          <AcademicInfoSection
            register={register}
            errors={errors}
            workWithUS={joinOurTeam}
            langLevelData={langLevelData}
            TypeOfSkillLevels={TypeOfSkillLevels}
            cvFileRequired={cvFileRequired}
            onCvFileChange={onCvFileChange}
            handleUniChange={handleUniChange}
          />
          <div className="mx-auto pb-4 mt-20">
            <ButtonRefactor
              type='submit'
              text={send ? translations.sendingButton : translations.sendButton}
              disabled={errorsList[0] ? true : false}
            />
          </div>
        </form>
        <UnifiedFormStatus status={submissionResult?.status ?? null} message={submissionResult?.message} />
      </div>
    </>
  );
}
