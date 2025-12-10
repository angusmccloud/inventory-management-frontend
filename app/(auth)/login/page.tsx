/**
 * Login Page - Family Inventory Management System
 * 
 * Provides authentication interface for users to sign in or register.
 * Uses Cognito for authentication via API endpoints.
 */

'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { login, register, confirmEmail } from '@/lib/auth';

type ViewMode = 'login' | 'register' | 'verify';

export default function LoginPage() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<ViewMode>('login');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [verificationCode, setVerificationCode] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

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
  };

  const getTitle = (): string => {
    switch (viewMode) {
      case 'register':
        return 'Create your account';
      case 'verify':
        return 'Verify your email';
      default:
        return 'Sign in to your account';
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h1 className="text-center text-3xl font-bold tracking-tight text-gray-900">
            Family Inventory Manager
          </h1>
          <h2 className="mt-6 text-center text-2xl font-semibold text-gray-900">
            {getTitle()}
          </h2>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="-space-y-px rounded-md shadow-sm">
            {viewMode === 'verify' ? (
              // Verification code input
              <>
                <div className="mb-4 text-sm text-gray-600">
                  <p>We sent a verification code to:</p>
                  <p className="font-semibold text-gray-900">{email}</p>
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
                    className="relative block w-full rounded-md border-0 px-3 py-2 text-center text-2xl tracking-widest text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-blue-600"
                    placeholder="000000"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                    maxLength={6}
                  />
                </div>
              </>
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
                      className="relative block w-full rounded-t-md border-0 px-3 py-2 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
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
                    className={`relative block w-full ${viewMode === 'register' ? '' : 'rounded-t-md'} border-0 px-3 py-2 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6`}
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
                    className="relative block w-full rounded-b-md border-0 px-3 py-2 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
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
            <div className="rounded-md bg-green-50 p-4">
              <p className="text-sm text-green-800">{success}</p>
            </div>
          )}

          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50"
            >
              {loading
                ? 'Please wait...'
                : viewMode === 'register'
                  ? 'Create Account'
                  : viewMode === 'verify'
                    ? 'Verify Email'
                    : 'Sign In'}
            </button>
          </div>

          <div className="text-center text-sm">
            {viewMode === 'verify' ? (
              <button
                type="button"
                onClick={switchToLogin}
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Back to sign in
              </button>
            ) : (
              <button
                type="button"
                onClick={viewMode === 'login' ? switchToRegister : switchToLogin}
                className="font-medium text-blue-600 hover:text-blue-500"
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
