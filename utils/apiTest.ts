// Test API connectivity
import apiClient from '@/utils/api';

export async function testApiConnection() {
  try {

    // Test with a simple GET request first
    const response = await apiClient.get('/health-check');
    return true;
  } catch (error: any) {

    // Additional debugging
    if (error.code === 'ERR_NETWORK') {
      console.error('Network error - possibly CORS or server unreachable');
    }

    return false;
  }
}

// Test with fetch API to compare
export async function testWithFetch() {
  try {
    const response = await fetch('https://back.novanestholding.com/investor-registration', {
      method: 'OPTIONS', // CORS preflight request
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.ok;
  } catch (error) {
    console.error('Fetch test failed:', error);
    return false;
  }
}
