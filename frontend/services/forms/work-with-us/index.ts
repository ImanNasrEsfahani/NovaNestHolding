import apiClient from '@/utils/api';
import type { PublicFormResponse } from '../jobs';
import { clearVisibleCvInput, syncCvFileWithVisibleInput } from '@/utils/activeCvUpload';

// Values match the selected options in en/fa/formComponent.json.
const professorPositions = new Set(['Professor', 'استاد دانشگاه']);
const studentPositions = new Set(['student', 'Student', 'دانشجو']);
const professorContracts = new Set(['professional Consultation', 'مشاوره تخصصی']);
const studentContracts = new Set(['hiring', 'استخدام', 'Internship', 'UniversityInternship']);

/** /join-us is different from /join-our-team; preserve its snake_case fields. */
export async function submitWorkWithUsForm(sendFormData: FormData, csrfToken?: string) {
  const language = typeof window !== 'undefined' && window.location.pathname.startsWith('/fa/') ? 'fa' : 'en';
  sendFormData.set('language', language);

  const { file } = syncCvFileWithVisibleInput(sendFormData);
  const position = String(sendFormData.get('your_position') ?? '').trim();
  if (professorPositions.has(position) && !file && typeof document !== 'undefined') {
    throw new Error(language === 'fa' ? 'لطفاً فایل رزومه را انتخاب کنید.' : 'Please select a CV file.');
  }

  // The contract select is conditional: the old React Hook Form value may
  // survive a switch from Professor to Student (or vice versa). Never send it.
  const contract = String(sendFormData.get('type_of_contract') ?? '').trim();
  if (contract && (
    (professorPositions.has(position) && !professorContracts.has(contract)) ||
    (studentPositions.has(position) && !studentContracts.has(contract))
  )) {
    sendFormData.delete('type_of_contract');
  }

  // There is no birthDate input on this page. Don't reuse old form defaults.
  sendFormData.delete('birthDate');

  const response = await apiClient.post<PublicFormResponse>('/work-with-us', sendFormData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Accept: 'application/json',
      ...(csrfToken ? { 'X-CSRFToken': csrfToken } : {}),
    },
    timeout: 150000,
  });
  const reference = response.data?.reference;
  if ((response.status === 201 || response.status === 202) &&
      Number.isInteger(reference) && reference > 0) {
    clearVisibleCvInput();
  }
  return response;
}
