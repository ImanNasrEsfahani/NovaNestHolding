import apiClient from '@/utils/api';

export async function submitJoinOurTeamForm(
  sendFormData: FormData,
  csrfToken: string,
) {
  try {
    const response = await apiClient.post(
      'join-our-team',
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