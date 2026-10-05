'use client';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useSubmit } from 'stores/dataStore';
import { FieldValues, DefaultValues } from 'react-hook-form';

type SubmitApi = (formData: FormData, csrfToken?: string) => Promise<any>;
type GetCsrf = () => Promise<string>;


interface UseFormHandlerOptions<TForm extends FieldValues> {
  initialValues: DefaultValues<TForm>;
  submitApi: SubmitApi;
  getCsrfToken?: GetCsrf;
  fileFieldNames?: string[]; // e.g. ['cvFile']
  fileState?: Record<string, File | '' | undefined>; // pass useFile's state object
  handleFileChange?: (payload: Record<string, File | ''>) => void; // pass the file store handler
  resetValues?: DefaultValues<TForm>;
  csrfFetchUrl?: string; // optional override
}

export function useFormHandler<TForm extends FieldValues>({
  initialValues,
  submitApi,
  getCsrfToken,
  fileFieldNames = [],
  fileState,
  handleFileChange,
  resetValues,
  csrfFetchUrl,
}: UseFormHandlerOptions<TForm>) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TForm>({
    mode: 'onBlur',
    defaultValues: initialValues as DefaultValues<TForm>,
  });

  const {
    csrfToken,
    handleTokenChange,
    handleSubmitingChange,
    handleSendChange,
    handleNotifChange,
    handleSuccessChange,
  } = useSubmit();

  useEffect(() => {
    let cancelled = false;
    async function fetchToken() {
      try {
        const token = getCsrfToken
          ? await getCsrfToken()
          : csrfFetchUrl
          ? await (await fetch(csrfFetchUrl)).text()
          : undefined;
        if (!cancelled && token) handleTokenChange(token);
      } catch (e) {
        // swallow - optional logging in caller
      }
    }
    fetchToken();
    return () => {
      cancelled = true;
    };
  }, [getCsrfToken, csrfFetchUrl, handleTokenChange]);

  const onSubmit = async (formData: TForm) => {
    handleSubmitingChange(true);
    handleSendChange(true);

    const sendFormData = new FormData();

    if (fileFieldNames.length && fileState) {
      for (const name of fileFieldNames) {
        const file = (fileState as any)[name] as File | '';
        if (file) sendFormData.append(name, file, (file as File).name);
      }
    }

    Object.entries(formData as any).forEach(([fieldName, fieldValue]) => {
      if (typeof fieldValue !== 'object' || fieldValue === null) {
        sendFormData.append(fieldName, String(fieldValue));
      } else if (Array.isArray(fieldValue) && fieldValue[0] != null) {
        sendFormData.append(fieldName, fieldValue[0]);
      }
    });

    try {
      const res = await submitApi(sendFormData, csrfToken);
      handleSuccessChange(true);
      handleNotifChange(true);
      handleSendChange(false);
      reset(resetValues ?? initialValues);
      setTimeout(() => handleNotifChange(false), 10000);
      return res;
    } catch (error) {
      handleSuccessChange(true);
      handleNotifChange(false);
      handleSendChange(false);
      setTimeout(() => handleNotifChange(false), 10000);
      throw error;
    }
  };

  const errorsList = useMemo(
    () => Object.entries(errors).map(([name, value]) => ({ name, value })),
    [errors]
  );

  const createFileAdapter = (fieldName: string) => {
    return (file: File) => {
      if (!handleFileChange) return;
      handleFileChange({ [fieldName]: file });
    };
  };

  return {
    register,
    handleSubmit,
    errors,
    errorsList,
    reset,
    onSubmit,
    createFileAdapter,
    onSubmitWrapped: handleSubmit(onSubmit),
  };
}