/**
 * API Client Base - Inventory HQ Frontend
 * 
 * Centralized HTTP client with error handling, authentication,
 * and standardized request/response processing with automatic token refresh.
 */

import { ApiError, ApiSuccess } from '@/types/entities';
import { refreshAccessToken, clearAuth, isTokenExpired, decodeToken } from './auth';

/**
 * API client configuration
 */
const API_BASE_URL = process.env['NEXT_PUBLIC_API_URL'] || 'http://localhost:3001';

/**
 * Token refresh buffer in seconds (5 minutes)
 * Refresh token if it expires within this time window
 */
const TOKEN_REFRESH_BUFFER = 5 * 60;

/**
 * HTTP methods
 */
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

/**
 * Request options
 */
interface RequestOptions {
  method: HttpMethod;
  headers?: Record<string, string>;
  body?: unknown;
  requireAuth?: boolean;
}

/**
 * Custom API error class
 */
export class ApiClientError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public code: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'ApiClientError';
  }
}

/**
 * Get authentication token from storage
 */
const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') {
    return null;
  }
  
  return localStorage.getItem('auth_token');
};

/**
 * Check if token needs refresh (expired or expiring soon)
 */
const shouldRefreshToken = (token: string): boolean => {
  const payload = decodeToken(token);
  if (!payload || !payload['exp']) {
    return true;
  }
  
  const expiration = payload['exp'] as number;
  const now = Math.floor(Date.now() / 1000);
  
  // Refresh if expired or expiring within the buffer window
  return expiration <= (now + TOKEN_REFRESH_BUFFER);
};

/**
 * Make an HTTP request to the API
 */
const request = async <T>(
  endpoint: string,
  options: RequestOptions,
  isRetry = false
): Promise<T> => {
  const { method, headers = {}, body, requireAuth = true } = options;
  
  // Proactively check and refresh token before making the request
  if (requireAuth && !isRetry) {
    const token = getAuthToken();
    if (token && shouldRefreshToken(token)) {
      console.log('Token expired or expiring soon, refreshing proactively...');
      const refreshSuccess = await refreshAccessToken();
      
      if (!refreshSuccess) {
        console.log('Proactive token refresh failed, logging out...');
        clearAuth();
        if (typeof window !== 'undefined') {
          window.location.href = '/login?reason=session_expired';
        }
        throw new ApiClientError(
          'Your session has expired. Please log in again.',
          401,
          'SESSION_EXPIRED'
        );
      }
      console.log('Proactive token refresh successful');
    }
  }
  
  // Build URL (remove trailing slash from base and leading slash from endpoint to avoid double slashes)
  const baseUrl = API_BASE_URL.replace(/\/$/, '');
  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${baseUrl}${path}`;
  
  // Build headers
  const requestHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...headers,
  };
  
  // Add authentication header if required
  if (requireAuth) {
    const token = getAuthToken();
    if (token) {
      requestHeaders['Authorization'] = `Bearer ${token}`;
    } else {
      throw new ApiClientError(
        'Authentication required',
        401,
        'UNAUTHORIZED'
      );
    }
  }
  
  // Build request config
  const config: RequestInit = {
    method,
    headers: requestHeaders,
  };
  
  if (body) {
    config.body = JSON.stringify(body);
  }
  
  try {
    // Make request
    const response = await fetch(url, config);
    
    // Handle 401 Unauthorized - attempt token refresh (fallback/safety net)
    if (response.status === 401 && requireAuth && !isRetry) {
      console.log('Received 401 despite proactive check, attempting token refresh as fallback...');
      
      const refreshSuccess = await refreshAccessToken();
      
      if (refreshSuccess) {
        console.log('Fallback token refresh successful, retrying request...');
        // Retry the request with the new token
        return request<T>(endpoint, options, true);
      } else {
        console.log('Fallback token refresh failed, logging out...');
        // Refresh failed - clear auth and redirect to login
        clearAuth();
        if (typeof window !== 'undefined') {
          window.location.href = '/login?reason=session_expired';
        }
        throw new ApiClientError(
          'Your session has expired. Please log in again.',
          401,
          'SESSION_EXPIRED'
        );
      }
    }
    
    // Handle other non-2xx responses
    if (!response.ok) {
      await handleErrorResponse(response);
    }
    
    // Handle 204 No Content
    if (response.status === 204) {
      return undefined as T;
    }
    
    // Parse JSON response
    const data: ApiSuccess<T> = await response.json();
    return data.data;
    
  } catch (error) {
    // Re-throw ApiClientError instances
    if (error instanceof ApiClientError) {
      throw error;
    }
    
    // Handle network errors
    if (error instanceof TypeError) {
      throw new ApiClientError(
        'Network error - please check your connection',
        0,
        'NETWORK_ERROR'
      );
    }
    
    // Handle other errors
    throw new ApiClientError(
      'An unexpected error occurred',
      500,
      'UNKNOWN_ERROR'
    );
  }
};

/**
 * Handle error responses from the API
 */
const handleErrorResponse = async (response: Response): Promise<never> => {
  let errorData: ApiError;
  
  try {
    errorData = await response.json();
  } catch {
    // If response body is not JSON, create generic error
    throw new ApiClientError(
      response.statusText || 'An error occurred',
      response.status,
      'HTTP_ERROR'
    );
  }
  
  // Throw structured error
  throw new ApiClientError(
    errorData.error.message,
    response.status,
    errorData.error.code,
    errorData.error.details
  );
};

/**
 * API client methods
 */
export const apiClient = {
  /**
   * GET request
   */
  get: <T>(endpoint: string, requireAuth = true): Promise<T> => {
    return request<T>(endpoint, { method: 'GET', requireAuth });
  },
  
  /**
   * POST request
   */
  post: <T>(endpoint: string, body?: unknown, requireAuth = true): Promise<T> => {
    return request<T>(endpoint, { method: 'POST', body, requireAuth });
  },
  
  /**
   * PUT request
   */
  put: <T>(endpoint: string, body?: unknown, requireAuth = true): Promise<T> => {
    return request<T>(endpoint, { method: 'PUT', body, requireAuth });
  },
  
  /**
   * PATCH request
   */
  patch: <T>(endpoint: string, body?: unknown, requireAuth = true): Promise<T> => {
    return request<T>(endpoint, { method: 'PATCH', body, requireAuth });
  },
  
  /**
   * DELETE request
   */
  delete: <T>(endpoint: string, requireAuth = true): Promise<T> => {
    return request<T>(endpoint, { method: 'DELETE', requireAuth });
  },
};

/**
 * Check if error is an API client error
 */
export const isApiClientError = (error: unknown): error is ApiClientError => {
  return error instanceof ApiClientError;
};

/**
 * Get error message from any error type
 */
export const getErrorMessage = (error: unknown): string => {
  if (isApiClientError(error)) {
    return error.message;
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return 'An unexpected error occurred';
};
