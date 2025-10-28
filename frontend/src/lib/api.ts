import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

const isDevelopment = process.env.NODE_ENV !== 'production';
const enableLogging = isDevelopment && process.env.NEXT_PUBLIC_ENABLE_API_LOGGING === 'true';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true, // Set to true if you need cookies
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

    if (enableLogging) {
      console.log('🚀 API Request:', {
        method: config.method?.toUpperCase(),
        url: config.url,
        params: config.params,
        baseURL: config.baseURL,
        fullURL: `${config.baseURL}${config.url}`,
      });
    }

    return config;
  },
  (error: AxiosError) => {
    if (enableLogging) {
      console.error('❌ Request Interceptor Error:', error);
    }
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    if (enableLogging) {
      console.log('✅ API Response:', {
        url: response.config.url,
        status: response.status,
        statusText: response.statusText,
        data: response.data,
        dataStructure: {
          hasSuccess: 'success' in response.data,
          hasData: 'data' in response.data,
          hasMeta: 'meta' in response.data,
          dataType: Array.isArray(response.data?.data) ? 'array' : typeof response.data?.data,
          dataLength: Array.isArray(response.data?.data) ? response.data.data.length : 'n/a',
        },
      });
    }

    return response;
  },
  (error: AxiosError) => {
    // Handle authentication errors
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      tokenManager.remove();
      
      if (!window.location.pathname.startsWith('/auth')) {
        window.location.href = '/auth/login';
      }
    }

    if (enableLogging || error.response?.status && error.response.status >= 500) {
      console.error('❌ API Error:', {
        url: error.config?.url,
        method: error.config?.method?.toUpperCase(),
        status: error.response?.status,
        statusText: error.response?.statusText,
        message: error.message,
        errorData: error.response?.data,
        isNetworkError: !error.response,
      });
    }

    return Promise.reject(error);
  }
);

/**
 * Generic API request handler with error handling and fallback values
 * This returns the raw axios response data, unwrapped
 */
async function handleApiRequest<T>(
  requestFn: () => Promise<any>,
  fallbackValue: T
): Promise<T> {
  try {
    const response = await requestFn();
    const { data } = response;
    
    if (enableLogging) {
      console.log('📦 handleApiRequest - Raw data:', {
        hasData: !!data,
        type: typeof data,
        isArray: Array.isArray(data),
        keys: data && typeof data === 'object' ? Object.keys(data) : [],
        structure: {
          hasSuccess: data?.success !== undefined,
          hasData: data?.data !== undefined,
          hasMeta: data?.meta !== undefined,
        },
        sample: JSON.stringify(data).substring(0, 200) + '...',
      });
    }
    
    return data ?? fallbackValue;
  } catch (error) {
    // Log errors in development or for server errors (500+)
    const isServerError = error instanceof AxiosError && 
                          error.response?.status && 
                          error.response.status >= 500;
    
    if (enableLogging || isServerError) {
      console.error('💥 handleApiRequest Error:', {
        status: error instanceof AxiosError ? error.response?.status : 'unknown',
        message: error instanceof Error ? error.message : 'Unknown error',
        errorType: error instanceof AxiosError ? 'AxiosError' : typeof error,
        errorData: error instanceof AxiosError ? error.response?.data : undefined,
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
    // Try to get message from various possible locations
    const data = error.response?.data as any;
    return data?.message || 
           data?.error || 
           error.message || 
           'An error occurred';
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

/**
 * Check if error is a validation error (422)
 */
export function isValidationError(error: unknown): boolean {
  return isApiError(error) && error.response?.status === 422;
}

/**
 * Get validation errors from 422 response
 */
export function getValidationErrors(error: unknown): Record<string, string[]> | null {
  if (isValidationError(error)) {
    const data = (error as AxiosError).response?.data as any;
    return data?.errors || null;
  }
  return null;
}

export default api;
export { tokenManager, handleApiRequest, isDevelopment, enableLogging };
