/**
 * API Client Base - Family Inventory Management System Frontend
 * 
 * Centralized HTTP client with error handling, authentication,
 * and standardized request/response processing.
 */

import { ApiError, ApiSuccess } from '@/types/entities';

/**
 * API client configuration
 */
const API_BASE_URL = process.env['NEXT_PUBLIC_API_URL'] || 'http://localhost:3001';

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
 * Make an HTTP request to the API
 */
const request = async <T>(
  endpoint: string,
  options: RequestOptions
): Promise<T> => {
  const { method, headers = {}, body, requireAuth = true } = options;
  
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
    
    // Handle non-2xx responses
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
