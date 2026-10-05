import apiClient from '@/utils/api';

export async function submitHandiCraftApplicationForm(
  sendFormData: FormData,
  csrfToken: string,
) {
  try {
    const response = await apiClient.post(
      'handicraft-form',
      sendFormData,
      {
        headers: {
          'content-type': 'multipart/form-data',
          'X-CSRFToken': csrfToken,
        },
      }
    );

    return response;
  } catch (error) {
    console.error('Error sending form data:', error);
  }
}
