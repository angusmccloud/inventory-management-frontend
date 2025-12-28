/**
 * Login Page - Inventory HQ
 * 
 * Provides authentication interface for users to sign in or register.
 * Uses Cognito for authentication via API endpoints.
 */

'use client';

import { useState, useEffect, FormEvent, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { login, register, confirmEmail, forgotPassword, confirmForgotPassword } from '@/lib/auth';
import { Button, Alert } from '@/components/common';

type ViewMode = 'login' | 'register' | 'verify' | 'forgot-password' | 'reset-password';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [viewMode, setViewMode] = useState<ViewMode>('login');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [verificationCode, setVerificationCode] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  // Check for session expiration message
  useEffect(() => {
    const reason = searchParams.get('reason');
    if (reason === 'session_expired') {
      setError('Your session has expired. Please log in again.');
    }
  }, [searchParams]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (viewMode === 'register') {
        // Handle registration
        if (!name.trim()) {
          setError('Name is required');
          setLoading(false);
          return;
        }
        
        const response = await register(email, password, name);
        
        if (response.success && response.requiresVerification) {
          setSuccess(response.message || 'Check your email for a verification code!');
          setViewMode('verify');
          setPassword(''); // Clear password for security
        } else if (response.success) {
          setSuccess('Account created! You can now log in.');
          setViewMode('login');
          setPassword('');
        } else {
          setError(response.message || 'Registration failed');
        }
      } else if (viewMode === 'verify') {
        // Handle email verification
        const response = await confirmEmail(email, verificationCode);
        
        if (response.success) {
          setSuccess(response.message || 'Email verified! You can now log in.');
          setViewMode('login');
          setVerificationCode('');
        } else {
          setError(response.message || 'Verification failed');
        }
      } else if (viewMode === 'forgot-password') {
        // Handle forgot password - send reset code
        const response = await forgotPassword(email);
        
        if (response.success) {
          setSuccess(response.message || 'Password reset code sent to your email!');
          setViewMode('reset-password');
        } else {
          setError(response.message || 'Failed to send reset code');
        }
      } else if (viewMode === 'reset-password') {
        // Handle password reset with code
        if (newPassword !== confirmPassword) {
          setError('Passwords do not match');
          setLoading(false);
          return;
        }
        
        if (newPassword.length < 8) {
          setError('Password must be at least 8 characters');
          setLoading(false);
          return;
        }
        
        const response = await confirmForgotPassword(email, verificationCode, newPassword);
        
        if (response.success) {
          setSuccess(response.message || 'Password reset successful! You can now log in.');
          setViewMode('login');
          setVerificationCode('');
          setNewPassword('');
          setConfirmPassword('');
        } else {
          setError(response.message || 'Failed to reset password');
        }
      } else {
        // Handle login
        const response = await login(email, password);
        
        if (response.success) {
          router.push('/dashboard');
        } else if (response.requiresVerification) {
          setError('Please verify your email first. Check your inbox for a verification code.');
          setViewMode('verify');
        } else {
          setError(response.message || 'Login failed');
        }
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  const switchToLogin = (): void => {
    setViewMode('login');
    setError('');
    setSuccess('');
    setPassword('');
    setName('');
    setVerificationCode('');
  };

  const switchToRegister = (): void => {
    setViewMode('register');
    setError('');
    setSuccess('');
    setPassword('');
    setName('');
    setVerificationCode('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const switchToForgotPassword = (): void => {
    setViewMode('forgot-password');
    setError('');
    setSuccess('');
    setPassword('');
    setName('');
    setVerificationCode('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const getTitle = (): string => {
    switch (viewMode) {
      case 'register':
        return 'Create your account';
      case 'verify':
        return 'Verify your email';
      case 'forgot-password':
        return 'Reset your password';
      case 'reset-password':
        return 'Enter new password';
      default:
        return 'Sign in to your account';
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h1 className="text-center text-3xl font-bold tracking-tight text-text-default">
            Inventory HQ
          </h1>
          <h2 className="mt-6 text-center text-2xl font-semibold text-text-default">
            {getTitle()}
          </h2>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="-space-y-px rounded-md shadow-sm">
            {viewMode === 'verify' || viewMode === 'reset-password' ? (
              // Verification code input
              <>
                <div className="mb-4 text-sm text-text-secondary">
                  <p>We sent a verification code to:</p>
                  <p className="font-semibold text-text-default">{email}</p>
                </div>
                <div>
                  <label htmlFor="code" className="sr-only">
                    Verification Code
                  </label>
                  <input
                    id="code"
                    name="code"
                    type="text"
                    required
                    className="relative block w-full rounded-md border-0 px-3 py-2 text-center text-2xl tracking-widest text-text-default bg-surface ring-1 ring-inset ring-border placeholder:text-text-disabled focus:z-10 focus:ring-2 focus:ring-inset focus:ring-primary"
                    placeholder="000000"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                    maxLength={6}
                  />
                </div>
                {viewMode === 'reset-password' && (
                  <>
                    <div className="mt-4">
                      <label htmlFor="new-password" className="sr-only">
                        New Password
                      </label>
                      <input
                        id="new-password"
                        name="new-password"
                        type="password"
                        autoComplete="new-password"
                        required
                        className="relative block w-full rounded-t-md border-0 px-3 py-2 text-text-default bg-surface ring-1 ring-inset ring-border placeholder:text-text-disabled focus:z-10 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                        placeholder="New Password (min 8 chars)"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        minLength={8}
                      />
                    </div>
                    <div>
                      <label htmlFor="confirm-password" className="sr-only">
                        Confirm Password
                      </label>
                      <input
                        id="confirm-password"
                        name="confirm-password"
                        type="password"
                        autoComplete="new-password"
                        required
                        className="relative block w-full rounded-b-md border-0 px-3 py-2 text-text-default bg-surface ring-1 ring-inset ring-border placeholder:text-text-disabled focus:z-10 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                        placeholder="Confirm New Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        minLength={8}
                      />
                    </div>
                  </>
                )}
              </>
            ) : viewMode === 'forgot-password' ? (
              // Forgot password - email only
              <div>
                <label htmlFor="email" className="sr-only">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="relative block w-full rounded-md border-0 px-3 py-2 text-text-default bg-surface ring-1 ring-inset ring-border placeholder:text-text-disabled focus:z-10 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            ) : (
              // Login or Register form
              <>
                {viewMode === 'register' && (
                  <div>
                    <label htmlFor="name" className="sr-only">
                      Full Name
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      className="relative block w-full rounded-t-md border-0 px-3 py-2 text-text-default bg-surface ring-1 ring-inset ring-border placeholder:text-text-disabled focus:z-10 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                      placeholder="Full Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                )}
                <div>
                  <label htmlFor="email" className="sr-only">
                    Email address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className={`relative block w-full ${viewMode === 'register' ? '' : 'rounded-t-md'} border-0 px-3 py-2 text-text-default bg-surface ring-1 ring-inset ring-border placeholder:text-text-disabled focus:z-10 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6`}
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="password" className="sr-only">
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete={viewMode === 'register' ? 'new-password' : 'current-password'}
                    required
                    className="relative block w-full rounded-b-md border-0 px-3 py-2 text-text-default bg-surface ring-1 ring-inset ring-border placeholder:text-text-disabled focus:z-10 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                    placeholder="Password (min 8 chars)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    minLength={8}
                  />
                </div>
              </>
            )}
          </div>

          {success && (
            <Alert severity="success">
              {success}
            </Alert>
          )}

          {error && (
            <Alert severity="error">
              {error}
            </Alert>
          )}

          <div>
            <Button
              type="submit"
              disabled={loading}
              loading={loading}
              variant="primary"
              fullWidth
            >
              {viewMode === 'register'
                ? 'Create Account'
                : viewMode === 'verify'
                  ? 'Verify Email'
                  : viewMode === 'forgot-password'
                    ? 'Send Reset Code'
                    : viewMode === 'reset-password'
                      ? 'Reset Password'
                      : 'Sign In'}
            </Button>
          </div>

          {viewMode === 'login' && (
            <div className="flex items-center justify-between">
              <div className="text-sm">
                <button
                  type="button"
                  onClick={switchToForgotPassword}
                  className="font-medium text-primary hover:text-primary-hover"
                >
                  Forgot your password?
                </button>
              </div>
            </div>
          )}

          <div className="text-center text-sm">
            {viewMode === 'verify' || viewMode === 'forgot-password' || viewMode === 'reset-password' ? (
              <button
                type="button"
                onClick={switchToLogin}
                className="font-medium text-primary hover:text-primary-hover"
              >
                Back to sign in
              </button>
            ) : (
              <button
                type="button"
                onClick={viewMode === 'login' ? switchToRegister : switchToLogin}
                className="font-medium text-primary hover:text-primary-hover"
              >
                {viewMode === 'login'
                  ? "Don't have an account? Create one"
                  : 'Already have an account? Sign in'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-text-secondary">Loading...</div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
