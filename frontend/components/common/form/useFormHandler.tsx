'use client';

import { useEffect, useMemo, useState } from 'react';
import { useForm, type FieldValues, type DefaultValues } from 'react-hook-form';
import type { SubmissionStatus } from './UnifiedFormSubmit';

type SubmitApiResponse = {
  status: number;
  data?: { reference?: number; notifications_sent?: boolean; message?: string };
};
type SubmitApi = (data: FormData, csrfToken?: string) => Promise<SubmitApiResponse>;
type GetCsrf = () => Promise<string>;

type UseFormHandlerOptions<TForm extends FieldValues> = {
  initialValues: DefaultValues<TForm>;
  submitApi: SubmitApi;
  getCsrfToken?: GetCsrf;
  fileFieldNames?: string[];
  fileState?: Record<string, File | '' | null | undefined>;
  handleFileChange?: (payload: Record<string, File | ''>) => void;
  resetValues?: DefaultValues<TForm>;
  csrfFetchUrl?: string;
};

/** Compatibility helper for older forms. Submission state is LOCAL, errors
 * propagate to callers, and fields/files reset only after confirmed storage.
 * This helper has no active callers at the time of this change.
 */
export function useFormHandler<TForm extends FieldValues>({
  initialValues, submitApi, getCsrfToken, fileFieldNames = [], fileState,
  handleFileChange, resetValues, csrfFetchUrl,
}: UseFormHandlerOptions<TForm>) {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<TForm>({
    mode: 'onBlur', defaultValues: initialValues,
  });
  const [csrfToken, setCsrfToken] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<{
    status: SubmissionStatus; reference?: number;
  } | null>(null);

  useEffect(() => {
    let cancelled = false;
    if (!getCsrfToken && !csrfFetchUrl) return;
    const load = async () => {
      try {
        const token = getCsrfToken
          ? await getCsrfToken()
          : await (await fetch(csrfFetchUrl!)).text();
        if (!cancelled && token) setCsrfToken(token);
      } catch (error) {
        if (!cancelled) console.error('Unable to load optional CSRF token', error);
      }
    };
    void load();
    return () => { cancelled = true; };
  }, [getCsrfToken, csrfFetchUrl]);

  const onSubmit = async (values: TForm) => {
    setIsSubmitting(true);
    setSubmissionResult(null);
    const data = new FormData();
    const uploaded = new Set<string>();
    for (const name of fileFieldNames) {
      const file = fileState?.[name];
      if (typeof File !== 'undefined' && file instanceof File) {
        data.append(name, file, file.name);
        uploaded.add(name);
      }
    }
    for (const [name, value] of Object.entries(values)) {
      if (uploaded.has(name) || value == null) continue;
      if (typeof File !== 'undefined' && value instanceof File) {
        data.append(name, value, value.name);
      } else if (value instanceof Date && !Number.isNaN(value.getTime())) {
        const y = value.getFullYear();
        const m = String(value.getMonth() + 1).padStart(2, '0');
        const d = String(value.getDate()).padStart(2, '0');
        data.append(name, `${y}-${m}-${d}`);
      } else if (typeof value !== 'object') {
        data.append(name, String(value));
      } else if (typeof FileList !== 'undefined' && value instanceof FileList && value.length) {
        data.append(name, value[0], value[0].name);
      }
    }
    try {
      const response = await submitApi(data, csrfToken);
      const reference = response.data?.reference;
      if ((response.status !== 201 && response.status !== 202) ||
          !Number.isInteger(reference) || !reference || reference <= 0) {
        throw new Error('API did not confirm storage with a valid reference');
      }
      reset(resetValues ?? initialValues);
      if (handleFileChange) {
        // Set.forEach works with the existing ES5 TypeScript target, unlike
        // for...of over a Set without downlevelIteration enabled.
        uploaded.forEach((name) => handleFileChange({ [name]: '' }));
      }
      setSubmissionResult({
        status: response.status === 202 || response.data?.notifications_sent !== true
          ? 'pending' : 'success',
        reference,
      });
      return response;
    } catch (error) {
      setSubmissionResult({ status: 'error' });
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const errorsList = useMemo(() => Object.entries(errors).map(([name, value]) => ({ name, value })), [errors]);
  const createFileAdapter = (fieldName: string) => (file: File) => {
    handleFileChange?.({ [fieldName]: file });
  };

  return {
    register, handleSubmit, errors, errorsList, reset, onSubmit,
    createFileAdapter, onSubmitWrapped: handleSubmit(onSubmit),
    isSubmitting, submissionResult,
  };
}
