'use client';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { JoinOurTeamFormDataType } from '@/types/global';
import NotificationSendForm from '@/components/common/form/NotificationSendForm';
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
    // Set loading and sending states.
    handleSubmitingChange(true);
    handleSendChange(true);

    // Create a FormData object for form data.
    const sendFormData = new FormData();

    const filePostMap = {
      cvFile: cvFileState.cvFile
    };

    for (const [fieldName, file] of Object.entries(filePostMap)) {
      if (file) {
        sendFormData.append(fieldName, file, file.name);
      }
    }

    // Append all non-file form fields.
    Object.entries(formData).forEach(([fieldName, fieldValue]) => {
      if (typeof fieldValue !== 'object' || fieldValue === null) {
        sendFormData.append(fieldName, String(fieldValue));
      } else sendFormData.append(fieldName, fieldValue[0]);
    });

    // Send the form data to the API.
    submitWorkWithUsForm(sendFormData, csrfToken)
      .then(() => {
        handleSuccessChange(true);
        handleNotifChange(true);
        handleSendChange(false);
        reset(initialJoinOurTeamFormData); // Country does not reset
        setTimeout(() => {
          handleNotifChange(false);
        }, 10000); // 10 seconds in milliseconds
      })
      .catch(() => {
        handleSuccessChange(true);
        handleNotifChange(false);
        handleSendChange(false);
        reset(initialJoinOurTeamFormData);

        setTimeout(() => {
          handleNotifChange(false);
        }, 10000); // 10 seconds in milliseconds
      });
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
        <NotificationSendForm lang={lang} successMessage={translations.successMessage} failedMessage={translations.failedMessage} />
      </div>
    </>
  );
}