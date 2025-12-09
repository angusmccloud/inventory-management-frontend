/**
 * Authentication Helpers - Family Inventory Management System Frontend
 * 
 * Provides authentication utilities for Cognito integration,
 * token management, and user context access.
 */

import { UserContext } from '@/types/entities';

/**
 * Token storage keys
 */
const AUTH_TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const USER_CONTEXT_KEY = 'user_context';

/**
 * Cognito configuration (from environment variables)
 */
export const cognitoConfig = {
  userPoolId: process.env['NEXT_PUBLIC_COGNITO_USER_POOL_ID'] || '',
  clientId: process.env['NEXT_PUBLIC_COGNITO_CLIENT_ID'] || '',
  region: process.env['NEXT_PUBLIC_AWS_REGION'] || 'us-east-1',
};

/**
 * Store authentication tokens in local storage
 */
export const setAuthTokens = (
  idToken: string,
  refreshToken: string
): void => {
  if (typeof window === 'undefined') {
    return;
  }
  
  localStorage.setItem(AUTH_TOKEN_KEY, idToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
};

/**
 * Get authentication token from local storage
 */
export const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') {
    return null;
  }
  
  return localStorage.getItem(AUTH_TOKEN_KEY);
};

/**
 * Get refresh token from local storage
 */
export const getRefreshToken = (): string | null => {
  if (typeof window === 'undefined') {
    return null;
  }
  
  return localStorage.getItem(REFRESH_TOKEN_KEY);
};

/**
 * Clear all authentication data
 */
export const clearAuth = (): void => {
  if (typeof window === 'undefined') {
    return;
  }
  
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_CONTEXT_KEY);
};

/**
 * Store user context in local storage
 */
export const setUserContext = (context: UserContext): void => {
  if (typeof window === 'undefined') {
    return;
  }
  
  localStorage.setItem(USER_CONTEXT_KEY, JSON.stringify(context));
};

/**
 * Get user context from local storage
 */
export const getUserContext = (): UserContext | null => {
  if (typeof window === 'undefined') {
    return null;
  }
  
  const contextJson = localStorage.getItem(USER_CONTEXT_KEY);
  if (!contextJson) {
    return null;
  }
  
  try {
    return JSON.parse(contextJson) as UserContext;
  } catch {
    return null;
  }
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  return getAuthToken() !== null;
};

/**
 * Check if user has admin role
 */
export const isAdmin = (): boolean => {
  const context = getUserContext();
  return context?.role === 'admin';
};

/**
 * Check if user has suggester role
 */
export const isSuggester = (): boolean => {
  const context = getUserContext();
  return context?.role === 'suggester';
};

/**
 * Decode JWT token payload (without verification)
 * 
 * Note: This is for reading claims only. Verification happens on the backend.
 */
export const decodeToken = (token: string): Record<string, unknown> | null => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3 || !parts[1]) {
      return null;
    }
    
    const payload = parts[1];
    const decoded = atob(payload);
    return JSON.parse(decoded) as Record<string, unknown>;
  } catch {
    return null;
  }
};

/**
 * Check if token is expired
 */
export const isTokenExpired = (token: string): boolean => {
  const payload = decodeToken(token);
  if (!payload || !payload['exp']) {
    return true;
  }
  
  const expiration = payload['exp'] as number;
  const now = Math.floor(Date.now() / 1000);
  
  return expiration < now;
};

/**
 * Extract user context from ID token
 */
export const extractUserContext = (idToken: string): UserContext | null => {
  const payload = decodeToken(idToken);
  if (!payload) {
    return null;
  }
  
  return {
    memberId: payload['sub'] as string,
    familyId: (payload['custom:familyId'] as string) || '',
    role: (payload['custom:role'] as 'admin' | 'suggester') || 'suggester',
    email: payload['email'] as string,
    name: payload['name'] as string | undefined,
  };
};

/**
 * Handle successful login
 * 
 * Stores tokens and user context, then redirects to dashboard
 */
export const handleLogin = (idToken: string, refreshToken: string): void => {
  // Store tokens
  setAuthTokens(idToken, refreshToken);
  
  // Extract and store user context
  const userContext = extractUserContext(idToken);
  if (userContext) {
    setUserContext(userContext);
  }
  
  // Redirect to dashboard
  if (typeof window !== 'undefined') {
    window.location.href = '/dashboard';
  }
};

/**
 * Login with email and password
 * 
 * Authenticates user via Cognito and stores tokens
 */
export const login = async (
  email: string,
  _password: string
): Promise<{ success: boolean; message?: string }> => {
  try {
    // TODO: Implement Cognito authentication
    // For now, return mock response for development
    // Note: _password is prefixed with underscore as it's unused in mock implementation
    console.log('Login attempt:', email);
    
    // Mock successful login
    const mockIdToken = btoa(JSON.stringify({
      sub: 'mock-user-id',
      email,
      name: 'Test User',
      exp: Math.floor(Date.now() / 1000) + 3600,
    }));
    
    const mockRefreshToken = 'mock-refresh-token';
    
    setAuthTokens(mockIdToken, mockRefreshToken);
    
    const userContext: UserContext = {
      memberId: 'mock-user-id',
      familyId: '',
      role: 'admin',
      email,
      name: 'Test User',
    };
    
    setUserContext(userContext);
    
    return { success: true };
  } catch (error) {
    console.error('Login error:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Login failed',
    };
  }
};

/**
 * Register new user
 * 
 * Creates new user account in Cognito
 */
export const register = async (
  email: string,
  _password: string,
  name: string
): Promise<void> => {
  try {
    // TODO: Implement Cognito user registration
    // Note: _password is prefixed with underscore as it's unused in mock implementation
    console.log('Register attempt:', email, name);
    
    // Mock registration - in production, this would call Cognito
    await new Promise((resolve) => setTimeout(resolve, 500));
  } catch (error) {
    console.error('Registration error:', error);
    throw error instanceof Error ? error : new Error('Registration failed');
  }
};

/**
 * Handle logout
 * 
 * Clears all auth data and redirects to login
 */
export const handleLogout = (): void => {
  clearAuth();
  
  if (typeof window !== 'undefined') {
    window.location.href = '/login';
  }
};

/**
 * Require authentication (for use in components)
 * 
 * Returns true if authenticated, otherwise redirects to login
 */
export const requireAuth = (): boolean => {
  if (!isAuthenticated()) {
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
    return false;
  }
  
  return true;
};

/**
 * Require admin role (for use in components)
 * 
 * Returns true if user is admin, otherwise redirects to dashboard
 */
export const requireAdmin = (): boolean => {
  if (!requireAuth()) {
    return false;
  }
  
  if (!isAdmin()) {
    if (typeof window !== 'undefined') {
      window.location.href = '/dashboard';
    }
    return false;
  }
  
  return true;
};
