/**
 * Authentication Helpers - Inventory HQ Frontend
 * 
 * Provides authentication utilities for Cognito integration,
 * token management, and user context access.
 */

import { Amplify } from 'aws-amplify';
import {
  signIn,
  signUp,
  confirmSignUp,
  signOut,
  getCurrentUser,
  fetchAuthSession,
  resetPassword,
  confirmResetPassword,
} from 'aws-amplify/auth';
import { UserContext } from '@/types/entities';

// Configure Amplify
if (typeof window !== 'undefined') {
  Amplify.configure({
    Auth: {
      Cognito: {
        userPoolId: process.env['NEXT_PUBLIC_USER_POOL_ID'] || '',
        userPoolClientId: process.env['NEXT_PUBLIC_USER_POOL_CLIENT_ID'] || '',
        loginWith: {
          email: true,
        },
      },
    },
  }, {
    ssr: true,
  });
}

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
  userPoolId: process.env['NEXT_PUBLIC_USER_POOL_ID'] || '',
  clientId: process.env['NEXT_PUBLIC_USER_POOL_CLIENT_ID'] || '',
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
  password: string
): Promise<{ success: boolean; message?: string; requiresVerification?: boolean }> => {
  try {
    const { isSignedIn, nextStep } = await signIn({
      username: email,
      password,
    });
    
    if (!isSignedIn && nextStep.signInStep === 'CONFIRM_SIGN_UP') {
      return {
        success: false,
        requiresVerification: true,
        message: 'Please verify your email address first',
      };
    }
    
    if (isSignedIn) {
      // Get session tokens
      const session = await fetchAuthSession();
      const idToken = session.tokens?.idToken?.toString();
      const accessToken = session.tokens?.accessToken?.toString();
      
      if (idToken && accessToken) {
        setAuthTokens(idToken, accessToken);
        
        // Extract user context from ID token
        const userContext = extractUserContext(idToken);
        if (userContext) {
          setUserContext(userContext);
        }
      }
      
      return { success: true };
    }
    
    return {
      success: false,
      message: 'Sign in incomplete. Please try again.',
    };
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
  password: string,
  name: string
): Promise<{ success: boolean; message?: string; requiresVerification?: boolean }> => {
  try {
    const { isSignUpComplete, userId, nextStep } = await signUp({
      username: email,
      password,
      options: {
        userAttributes: {
          email,
          name,
        },
        autoSignIn: false,
      },
    });
    
    console.log('Sign up result:', { isSignUpComplete, userId, nextStep });
    
    if (nextStep.signUpStep === 'CONFIRM_SIGN_UP') {
      return {
        success: true,
        requiresVerification: true,
        message: 'Account created! Please check your email for a verification code.',
      };
    }
    
    return {
      success: true,
      message: 'Account created successfully!',
    };
  } catch (error) {
    console.error('Registration error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Registration failed';
    return {
      success: false,
      message: errorMessage,
    };
  }
};

/**
 * Confirm email verification code
 * 
 * Verifies user email with code sent by Cognito
 */
export const confirmEmail = async (
  email: string,
  code: string
): Promise<{ success: boolean; message?: string }> => {
  try {
    await confirmSignUp({
      username: email,
      confirmationCode: code,
    });
    
    return {
      success: true,
      message: 'Email verified successfully! You can now log in.',
    };
  } catch (error) {
    console.error('Verification error:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Verification failed',
    };
  }
};

/**
 * Handle logout
 * 
 * Signs out from Cognito and clears all auth data
 */
export const handleLogout = async (): Promise<void> => {
  try {
    await signOut();
    clearAuth();
    
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  } catch (error) {
    console.error('Logout error:', error);
    // Clear local data even if Cognito signout fails
    clearAuth();
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  }
};

/**
 * Get current authenticated user
 * 
 * Returns current user from Cognito session
 */
export const getCurrentAuthUser = async (): Promise<{
  userId: string;
  email?: string;
} | null> => {
  try {
    const user = await getCurrentUser();
    return {
      userId: user.userId,
      email: user.signInDetails?.loginId,
    };
  } catch {
    return null;
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

/**
 * Initiate forgot password flow
 * 
 * Sends password reset code to user's email via Cognito
 */
export const forgotPassword = async (
  email: string
): Promise<{ success: boolean; message?: string }> => {
  try {
    const output = await resetPassword({ username: email });
    
    const { nextStep } = output;
    
    if (nextStep.resetPasswordStep === 'CONFIRM_RESET_PASSWORD_WITH_CODE') {
      const codeDeliveryDetails = nextStep.codeDeliveryDetails;
      return {
        success: true,
        message: `Password reset code sent to ${codeDeliveryDetails.deliveryMedium === 'EMAIL' ? codeDeliveryDetails.destination : 'your email'}`,
      };
    }
    
    return {
      success: false,
      message: 'Unable to initiate password reset. Please try again.',
    };
  } catch (error) {
    console.error('Forgot password error:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to send reset code',
    };
  }
};

/**
 * Confirm forgot password with code and new password
 * 
 * Completes password reset using verification code from email
 */
export const confirmForgotPassword = async (
  email: string,
  code: string,
  newPassword: string
): Promise<{ success: boolean; message?: string }> => {
  try {
    await confirmResetPassword({
      username: email,
      confirmationCode: code,
      newPassword,
    });
    
    return {
      success: true,
      message: 'Password reset successful! You can now log in with your new password.',
    };
  } catch (error) {
    console.error('Confirm forgot password error:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to reset password',
    };
  }
};
