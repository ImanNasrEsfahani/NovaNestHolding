import apiClient from '@/utils/api';

export async function submitPartnerMembershipForm(
  sendFormData: FormData,
) {
  try {
    const response = await apiClient.post(
      'affiliate-registration-form',
      sendFormData,
      {
        headers: {
          'content-type': 'multipart/form-data',
        },
      }
    );




    return response;
  } catch (error) {

    console.error('Error sending form data:', error);


  }
}