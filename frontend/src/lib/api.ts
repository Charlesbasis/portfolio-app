import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

const isDevelopment = process.env.NODE_ENV !== 'production';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
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

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Handle authentication errors
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      tokenManager.remove();
      
      if (!window.location.pathname.startsWith('/auth')) {
        window.location.href = '/auth/login';
      }
    }

    // Handle network errors
    if (!error.response) {
      if (isDevelopment) {
        console.error('Network error:', error.message);
      }
    }

    return Promise.reject(error);
  }
);

/**
 * Generic API request handler with error handling and fallback values
 */
async function handleApiRequest<T>(
  requestFn: () => Promise<any>,
  fallbackValue: T
): Promise<T> {
  try {
    const { data } = await requestFn();
    
    // Only log in development
    if (isDevelopment) {
      console.log('API Response:', {
        hasData: !!data,
        keys: data ? Object.keys(data) : [],
        dataType: Array.isArray(data?.data) ? 'array' : typeof data?.data
      });
    }
    
    return data ?? fallbackValue;
  } catch (error) {
    // Log errors in development or for server errors (500+)
    const isServerError = error instanceof AxiosError && 
                          error.response?.status && 
                          error.response.status >= 500;
    
    if (isDevelopment || isServerError) {
      console.error('API Error:', {
        status: error instanceof AxiosError ? error.response?.status : 'unknown',
        message: error instanceof Error ? error.message : 'Unknown error',
        data: error instanceof AxiosError ? error.response?.data : undefined,
      });
    }
    
    return fallbackValue;
  }
}

/**
 * Type-safe API error handler
 */
export function isApiError(error: unknown): error is AxiosError {
  return error instanceof AxiosError;
}

/**
 * Get error message from API error
 */
export function getErrorMessage(error: unknown): string {
  if (isApiError(error)) {
    return error.response?.data?.message || error.message || 'An error occurred';
  }
  return error instanceof Error ? error.message : 'An unknown error occurred';
}

/**
 * Get HTTP status code from error
 */
export function getErrorStatus(error: unknown): number | undefined {
  if (isApiError(error)) {
    return error.response?.status;
  }
  return undefined;
}

export default api;
export { tokenManager, handleApiRequest, isDevelopment };
