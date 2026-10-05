'use client';
import React, { useEffect, useState, useRef } from 'react';  // Add useRef to imports
import { useForm } from 'react-hook-form';
import { JoinOurTeamFormDataType } from '@/types/global';
import NotificationSendForm from '@/components/common/form/NotificationSendForm';
import GetCsrfToken from '@/utils/get-csrf-token';
import { initialJoinOurTeamFormData } from '../../initials/initObjects';
import { submitJoinOurTeamForm } from '../../pages/api/jobs';
import PersonalInfoInput from '@/components/common/form/PersonalInfoInput';
import ButtonRefactor from '@/components/common/ButtonRefactor';
import { useSubmit } from 'stores/dataStore';
import { useFile } from 'stores/fileStore';
import FormTitle from '@/components/common/form/FormTitle';
import FileUpload from '@/components/common/form/FileUpload';
import YesOrNoQuestion from '@/components/startups-form/YesOrNoQuestion';
import Input from '@/components/common/form/Input';
import Select from '@/components/common/form/Select';
import TextArea from '@/components/common/TextArea';
import { birthDateValidatorFactory } from '@/utils/birthDateValidatorFactory';
import { Props } from './Props';

interface FileUploadRef {
  clearFile: () => void;
}

export default function JoinOurTeamFormClient({ lang, translations }: Props) {
  const NOTIFICATION_DURATION = 15000;
  const { send } = useSubmit();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    clearErrors,
    unregister,
    setValue
  } = useForm<JoinOurTeamFormDataType>({
    mode: 'onBlur',
    defaultValues: initialJoinOurTeamFormData
  });

  const { csrfToken, handleTokenChange, handleSubmitingChange, handleSendChange, handleNotifChange, handleSuccessChange } = useSubmit();
  const { cvFileState, handleCvFileChange } = useFile();

  const fileUploadRef = useRef<FileUploadRef>(null);  // Create ref for FileUpload

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const token = await GetCsrfToken(`${process.env.NEXT_PUBLIC_DJANGO_HOST_URL}/get-csrf-token`);
      if (!cancelled) handleTokenChange(token);
    })();
    return () => { cancelled = true; };
  }, [handleTokenChange]);

  const onSubmit = async (formData: JoinOurTeamFormDataType) => {
    handleSubmitingChange(true);
    handleSendChange(true);

    const sendFormData = new FormData();
    if (cvFileState.cvFile) sendFormData.append('cvFile', cvFileState.cvFile as File, (cvFileState.cvFile as File).name);

    Object.entries(formData).forEach(([k, v]) => {
      if (v == null) return;
      
      // Format birthDate to YYYY-MM-DD string
      if (k === 'birthDate' && v instanceof Date) {
        sendFormData.append(k, v.toISOString().split('T')[0]);
        return;
      }
      
      if (typeof v === 'object' && v[0]) sendFormData.append(k, v[0]);
      else sendFormData.append(k, String(v));
    });

    submitJoinOurTeamForm(sendFormData, csrfToken)
      .then(() => {
        handleSuccessChange(true);
        handleNotifChange(true);
        handleSendChange(false);
        reset(initialJoinOurTeamFormData);
        fileUploadRef.current?.clearFile();
        handleCvFileChange({ cvFile: null });
        setTimeout(() => handleNotifChange(false), NOTIFICATION_DURATION);
      })
      .catch((err) => {
        handleSuccessChange(false);
        handleNotifChange(true);
        handleSendChange(false);
        handleCvFileChange({ cvFile: null });
        setTimeout(() => handleNotifChange(false), NOTIFICATION_DURATION);
        console.error(err);
      });
  };

  const onCvFileChange = (file: File | null) => {
    handleCvFileChange({ cvFile: file ?? null });
    setValue('cvFile', file ?? null);
  };

  const [fileCounterState, setFileCounter] = useState<boolean>(false);

  // toggle upload mode — clear errors for the optional group when enabling upload
  const setFileCounterAndClear = (v: boolean) => {
    setFileCounter(v);

    const fields: (keyof JoinOurTeamFormDataType)[] = ['birthDate', 'educationLevel', 'educationField', 'workHistorySummary'];

    if (v) {
      // when resume is uploaded we want these fields NOT validated also unregister them so validation rules are removed
      clearErrors(fields);
      unregister(fields);

      // register cvFile as required
      register('cvFile', { required: "You need to upload your CV" });
      return;
    }

    clearErrors(fields);
    // re-register with the same rules used by the inputs
    register('educationLevel', { required: translations.EducationLevelsRequired || true });
    register('educationField', { required: translations.EducationFieldRequired || true });
    register('workHistorySummary', { required: translations.workHistorySummaryRequired || true });
    register('birthDate', { required: translations.birthDateRequired || true, validate: birthValidate });

    // unregister cvFile when not required
    unregister('cvFile');
  };

  const birthValidate = (value?: Date): string | true => {
    if (fileCounterState) return true;

    // convert Date to ISO yyyy-mm-dd string expected by the string-based validator
    const valStr =
      value instanceof Date ? value.toISOString().split('T')[0] : (typeof value === 'string' ? value : undefined);

    return birthDateValidatorFactory(14, {
      birthDateRequired: translations.birthDateRequired,
      birthDateErrorMessage: translations.birthDateErrorMessage,
      birthDateErrorMessageForFutureDate: translations.birthDateErrorMessageForFutureDate,
      birthDateErrorMessageForAge: translations.birthDateErrorMessageForAge
    })(valStr);
  };

  const errorsList = Object.entries(errors).map(([name, value]) => ({
    name: name,
    value: value
  }));

  return (
    <div className="max-w-responsive mx-auto py-20">
      <div className="h-[75px] md:h-[125px]">
        <FormTitle formTitle={translations.formTitle} formSubtitle={translations.formSubtitle} />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="w-full">
        <div className="mt-4 mb-6 grid grid-cols-1 gap-6 gap-y-4 p-3 md:grid-cols-2 xl:grid-cols-3">
          <PersonalInfoInput
            register={register}
            errors={errors}
            nameInputs={{
              firstName: 'firstName',
              lastName: 'lastName',
              email: 'email',
              phoneNumber: 'phoneNumber',
              countryOfResidence: 'countryOfResidence',
              provinceOfResidence: '',
              cityOfResidence: 'cityOfResidence',
              TypeOfCollaboration: 'typeOfCollaboration',
              FieldOfExpert: 'fieldOfExpert',
              FieldOfInterest: ''
            }}
            noLabel={false}
            translations={{
              firstName: translations.firstName,
              firstNameRequired: translations.firstNameRequired,
              firstNamePlaceholder: translations.firstNamePlaceholder,

              lastName: translations.lastName,
              lastNameRequired: translations.lastNameRequired,
              lastNamePlaceholder: translations.lastNamePlaceholder,

              email: translations.email,
              emailRequired: translations.emailRequired,
              emailErrorMessage: translations.emailErrorMessage,
              emailPlaceholder: translations.emailPlaceholder,

              phoneNumber: translations.phoneNumber,
              phoneNumberRequired: translations.phoneNumberRequired,
              phoneNumberErrorMessage: translations.phoneNumberErrorMessage,
              phoneNumberPlaceholder: translations.phoneNumberPlaceholder,

              countries: translations.countries,
              countryName: translations.countryName,
              countryNameRequired: translations.countryNameRequired,
              countryNamePlaceholder: translations.countryNamePlaceholder,

              provinceOfResidence: translations.provinceOfResidence,
              provinceOfResidenceRequired: translations.provinceOfResidenceRequired,
              provinceOfResidencePlaceholder: translations.provinceOfResidencePlaceholder,

              cityOfResidence: translations.cityOfResidence,
              cityOfResidenceRequired: translations.cityOfResidenceRequired,
              cityOfResidencePlaceholder: translations.cityOfResidencePlaceholder,

              TypeOfCollaboration: translations.TypeOfCollaboration,
              TypeOfCollaborationRequired: translations.TypeOfCollaborationRequired,
              TypeOfCollaborationPlaceholder: translations.TypeOfCollaborationPlaceholder,
              TypeOfCollaborationData: translations.TypeOfCollaborationData,

              FieldOfExpert: translations.FieldOfExpert,
              FieldOfExpertRequired: translations.FieldOfExpertRequired,
              FieldOfExpertPlaceholder: translations.FieldOfExpertPlaceholder,
              FieldOfExpertData: translations.FieldOfExpertData,

              FieldOfExpertOther: translations.FieldOfExpertOther,
              FieldOfExpertOtherRequired: translations.FieldOfExpertOtherRequired,
              FieldOfExpertOtherPlaceholder: translations.FieldOfExpertOtherPlaceholder,

              FieldOfInterest: translations.FieldOfInterest,
              FieldOfInterestRequired: translations.FieldOfInterestRequired,
              FieldOfInterestPlaceholder: translations.FieldOfInterestPlaceholder,
              FieldOfInterestData: translations.FieldOfInterestData,

              FieldOfInterestOther: translations.FieldOfInterestOther,
              FieldOfInterestOtherRequired: translations.FieldOfInterestOtherRequired,
              FieldOfInterestOtherPlaceholder: translations.FieldOfInterestOtherPlaceholder,
            }}
          />
        </div>

        <div className="w-full flex flex-col p-3">
          <YesOrNoQuestion
            title={translations.title}
            yesLabel={translations.yesLabel}
            noLabel={translations.noLabel}
            value={fileCounterState}
            onChange={setFileCounterAndClear}
            name="fileCounter"
          />
          <div
            aria-hidden={!fileCounterState}
            className={`w-full md:max-w-lg 2xl:max-w-xl mt-2 mx-auto bg-whiteGold drop-shadow-md overflow-hidden transition-[max-height,opacity,transform,padding] duration-900 ease-out origin-top min-h-0
              ${fileCounterState ? 'opacity-100 translate-y-0 pointer-events-auto' : 'max-h-0 opacity-0 -translate-y-2 py-0 pointer-events-none'}`}
          >
            <FileUpload
              ref={fileUploadRef}  // Attach ref here
              nameInput="cvFile"
              required={fileCounterState ? true : ""}
              errors={errors}
              label={translations.choseFile}
              onChange={onCvFileChange}
              disabled={!fileCounterState}
              file={cvFileState.cvFile}
            />
          </div>
        </div>

        <div
          aria-hidden={fileCounterState}
          className={`w-full transition-[max-height,opacity,transform,padding] duration-700 ease-out origin-top min-h-0
              ${!fileCounterState ? 'max-h-[1200px] opacity-100 translate-y-0 pointer-events-auto' : 'max-h-0 opacity-0 -translate-y-2 py-0 pointer-events-none'}`}
        >
          {/* disable native form controls while hidden to avoid focusable hidden elements */}
          <fieldset disabled={fileCounterState} className="w-full">
            <div className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 pt-6">
              <div className="col-span-1">
                <Input
                  id="birthDate"
                  register={register}
                  errors={errors}
                  nameInput="birthDate"
                  type="date"
                  label={translations.birthDate}
                  required={!fileCounterState ? translations.birthDateRequired : ""}
                  patternValue="" // date input provides yyyy-mm-dd, pattern not needed
                  patternMessage={translations.birthDateErrorMessage}
                  placeholder={translations.birthDatePlaceholder}
                  className="input"
                  labelClass=""
                  validate={birthValidate}
                />
              </div>
              <div className="col-span-1">
                <Select
                  register={register}
                  errors={errors}
                  nameInput="educationLevel"
                  label={translations.EducationLevels}
                  required={!fileCounterState ? translations.EducationLevelsRequired : ''}
                  labelClass=""
                  className="input"
                  placeholder={translations.EducationLevelsPlaceholder}
                  options={translations.EducationLevelsData}
                />
              </div>

              <div className="col-span-1">
                <Input
                  id="educationField"
                  register={register}
                  errors={errors}
                  nameInput="educationField"
                  type="text"
                  label={translations.EducationField}
                  required={!fileCounterState ? translations.EducationFieldRequired : ''}
                  placeholder={translations.EducationFieldPlaceholder}
                  className="input"
                  labelClass=""
                  patternValue=""
                  patternMessage=""
                />
              </div>
            </div>
          </fieldset>

          <div className="w-full">
            <TextArea
              title={translations.workHistorySummary}
              register={register}
              errors={errors}
              placeholder={translations.workHistorySummaryPlaceholder}
              nameTextArea="workHistorySummary"
              patternMessage=""
              patternValue=""
              required={!fileCounterState ? translations.workHistorySummaryRequired : ''}
              rows={8}
              maxLength={1450}
              maxLengthMessage={translations.workHistorySummaryErrorMessage}
              validate=""
            />
          </div>
        </div>

        <div className="w-full max-w-responsive mx-auto px-2 md:px-9 py-6">
          {translations.formDescription.map((paragraph, index) => (
            <p key={index} className="text-sm font-normal text-gray-800 font-header">
              * {paragraph}
            </p>
          ))}
        </div>

        <div className="mx-auto pb-4">
          <ButtonRefactor
            type="submit"
            text={send ? translations.sendingButton : translations.sendButton}
            disabled={Array.isArray(errorsList) && errorsList.length > 0}
            errorList={Array.isArray(errorsList) && errorsList.length > 0 ? errorsList.map((e) => e.name) : []}
          />
        </div>
      </form>
      <NotificationSendForm lang={lang} successMessage={translations.successMessage} failedMessage={translations.failedMessage} />
    </div>
  );
}
