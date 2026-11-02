import axios from 'axios';
import { submissionContextHeader } from '@/utils/formContext';

// Keep the existing API origin, timeouts and rejection behavior.
const baseURL = process.env.NEXT_PUBLIC_DJANGO_HOST_URL || 'https://back.novanestholding.com';
const apiClient = axios.create({
  baseURL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  withCredentials: false,
  maxRedirects: 3,
});

// Add optional marketing context only to public form submissions, NOT to
// unrelated account/login requests using the same Axios instance.
const publicFormPaths = new Set([
  'contactUs-form', 'small-reservation', 'investor-registration',
  'partner-membership', 'startups-form', 'join-as-mentor',
  'join-as-a-trainee', 'join-our-team', 'work-with-us', 'contact-profile',
]);
apiClient.interceptors.request.use(
  (config) => {
    const path = (config.url || '').replace(/^\/+/, '').split('?')[0].replace(/\/+$/, '');
    if (config.method?.toLowerCase() === 'post' && publicFormPaths.has(path)) {
      const context = submissionContextHeader();
      if (context) config.headers.set('X-Submission-Context', context);
    }
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  },
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Response error:', {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      data: error.response?.data,
    });
    if (!error.response) console.error('Network error or CORS issue detected');
    return Promise.reject(error);
  },
);

export default apiClient;
