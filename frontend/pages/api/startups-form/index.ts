import apiClient from '@/utils/api';

export async function submitStartupsForm(
  sendFormData: FormData,
) {

  try {
    const response = await apiClient.post(
      'startups-form',
      sendFormData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );


    return response;
  } catch (error) {
    console.error('Error sending form data:', error);
  }
}