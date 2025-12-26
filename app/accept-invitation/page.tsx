/**
 * Accept Invitation Page
 * Feature: 003-member-management
 * 
 * Public page for accepting family invitations
 */

'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { acceptInvitation } from '@/lib/api/invitations';
import { getErrorMessage } from '@/lib/api-client';
import { Button, Input, Alert } from '@/components/common';

function AcceptInvitationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [token, setToken] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const tokenParam = searchParams.get('token');
    if (tokenParam) {
      setToken(tokenParam);
    } else {
      setError('Invalid invitation link - no token provided');
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!token) {
      setError('Invalid invitation token');
      return;
    }

    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }

    if (password && password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password && password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await acceptInvitation({
        token,
        name: name.trim(),
        password: password || undefined,
      });

      setSuccess(true);

      // Store auth info in user context (in production, this would come from Cognito auth)
      const userContext = {
        memberId: response.member.memberId,
        familyId: response.family.familyId,
        role: response.member.role,
        email: response.member.email,
        name: response.member.name,
      };
      localStorage.setItem('user_context', JSON.stringify(userContext));

      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/30 mb-4">
              <svg
                className="h-10 w-10 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Welcome to the Family! 🎉
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Your invitation has been accepted successfully.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Redirecting to dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Accept Family Invitation
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            You've been invited to join a family inventory
          </p>
        </div>

        {error && (
          <Alert severity="error" className="mb-6">
            {error}
          </Alert>
        )}

        {!token ? (
          <div className="text-center py-6">
            <p className="text-gray-600">
              Invalid invitation link. Please check your email for the correct link.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Input
                type="text"
                id="name"
                label="Your Name *"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Enter your full name"
                disabled={isSubmitting}
                helperText="This name will be visible to other family members"
              />
            </div>

            <div>
              <Input
                type="password"
                id="password"
                label="Password (Optional)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password"
                disabled={isSubmitting}
                helperText="Leave blank to use email-based authentication"
              />
            </div>

            {password && (
              <div>
                <Input
                  type="password"
                  id="confirmPassword"
                  label="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  disabled={isSubmitting}
                />
              </div>
            )}

            <Button
              type="submit"
              disabled={isSubmitting || !token}
              loading={isSubmitting}
              variant="primary"
              size="lg"
              fullWidth
            >
              Accept Invitation
            </Button>
          </form>
        )}

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            By accepting, you agree to collaborate with your family members
          </p>
        </div>
      </div>
    </div>
  );
}

export default function AcceptInvitationPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      }
    >
      <AcceptInvitationContent />
    </Suspense>
  );
}

