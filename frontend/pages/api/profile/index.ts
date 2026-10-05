import apiClient from '@/utils/api';

export async function ContactProfileForm(
  sendFormData: FormData,
) {
  try {
    // Make sure this endpoint matches your backend
    const response = await apiClient.post(
      '/contact-profile', // Note the leading slash
      sendFormData,
      {
        headers: {
          'content-type': 'multipart/form-data',
        },
      }
    );

    console.log('Response:', response);
    return response;
  } catch (error) {
    console.error('Error sending form data:', error);
    throw error; // Re-throw to handle in the component
  }
}