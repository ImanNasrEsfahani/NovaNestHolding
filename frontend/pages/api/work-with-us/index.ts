import apiClient from '@/utils/api';

export async function submitWorkWithUsForm(
  sendFormData: FormData,
  csrfToken: string
) {
  try {
    const response = await apiClient.post('work-with-us', sendFormData, {
      headers: {
        'X-CSRFToken': csrfToken,
        'content-type': 'multipart/form-data'
      }

    });
    return response;
  } catch (error) {
    console.error('Error sending form data:', error);
  }
}