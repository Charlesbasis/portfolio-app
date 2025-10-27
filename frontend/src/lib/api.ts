import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000, // 10 second timeout
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true,
});

const tokenManager = {
  get: () => typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null,
  set: (token: string) => typeof window !== 'undefined' && localStorage.setItem('auth_token', token),
  remove: () => typeof window !== 'undefined' && localStorage.removeItem('auth_token'),
};

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = tokenManager.get();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      tokenManager.remove();
      
      if (!window.location.pathname.startsWith('/auth')) {
        window.location.href = '/auth/login';
      }
    }
    if (!error.response) {
      console.error('Network error:', error.message);
    }

    return Promise.reject(error);
  }
);

async function handleApiRequest<T>(
  requestFn: () => Promise<any>,
  fallbackValue: T
): Promise<T> {
  try {
    const { data } = await requestFn();
    
    console.log('API Response structure:', {
      hasData: !!data,
      keys: data ? Object.keys(data) : [],
      dataType: Array.isArray(data?.data) ? 'array' : typeof data?.data
    });
    
    return data ?? fallbackValue;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error('API Error:', {
        status: error.response?.status,
        message: error.message,
        data: error.response?.data,
      });
    }
    return fallbackValue;
  }
}

export default api;
export { tokenManager, handleApiRequest };
