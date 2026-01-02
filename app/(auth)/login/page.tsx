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
import { Button, Alert, PageLoading, Input } from '@/components/common';
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
          <div className="space-y-4">
            {viewMode === 'verify' || viewMode === 'reset-password' ? (
              // Verification code input
              <>
                <div className="mb-4 text-sm text-text-secondary">
                  <p>We sent a verification code to:</p>
                  <p className="font-semibold text-text-default">{email}</p>
                </div>
                <Input
                  id="code"
                  name="code"
                  type="text"
                  required
                  label="Verification Code"
                  placeholder="000000"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                  maxLength={6}
                  className="text-center text-2xl tracking-widest"
                />
                {viewMode === 'reset-password' && (
                  <>
                    <Input
                      id="new-password"
                      name="new-password"
                      type="password"
                      autoComplete="new-password"
                      required
                      label="New Password"
                      placeholder="New Password (min 8 chars)"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      minLength={8}
                      helpText="Must be at least 8 characters"
                    />
                    <Input
                      id="confirm-password"
                      name="confirm-password"
                      type="password"
                      autoComplete="new-password"
                      required
                      label="Confirm Password"
                      placeholder="Confirm New Password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      minLength={8}
                    />
                  </>
                )}
              </>
            ) : viewMode === 'forgot-password' ? (
              // Forgot password - email only
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                label="Email address"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                helpText="Enter your email to receive a password reset code"
              />
            ) : (
              // Login or Register form
              <>
                {viewMode === 'register' && (
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    required
                    label="Full Name"
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                )}
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  label="Email address"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete={viewMode === 'register' ? 'new-password' : 'current-password'}
                  required
                  label="Password"
                  placeholder="Password (min 8 chars)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={8}
                  helpText={viewMode === 'register' ? 'Must be at least 8 characters' : undefined}
                />
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

          <div className="flex flex-col items-center space-y-4">
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
            <div className="flex flex-col items-center">
              <Button
                variant="secondary"
                size="sm"
                onClick={switchToForgotPassword}
              >
                Forgot your password?
              </Button>
            </div>
          )}

          <div className="flex flex-col items-center">
            {viewMode === 'verify' || viewMode === 'forgot-password' || viewMode === 'reset-password' ? (
              <Button
                variant="secondary"
                size="sm"
                onClick={switchToLogin}
              >
                Back to sign in
              </Button>
            ) : (
              <Button
                variant="secondary"
                size="sm"
                onClick={viewMode === 'login' ? switchToRegister : switchToLogin}
              >
                {viewMode === 'login'
                  ? "Don't have an account? Create one"
                  : 'Already have an account? Sign in'}
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<PageLoading message="Loading..." />}>
      <LoginForm />
    </Suspense>
  );
}
