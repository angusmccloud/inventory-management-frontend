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
import { Button, Alert, PageLoading, Input } from '@/components/common';

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
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-surface rounded-2xl shadow-xl p-8">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 mb-4">
              <svg
                className="h-10 w-10 text-primary"
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
            <h1 className="text-2xl font-bold text-text-default mb-2">
              Welcome to the Family! 🎉
            </h1>
            <p className="text-text-secondary mb-4">
              Your invitation has been accepted successfully.
            </p>
            <p className="text-sm text-text-secondary">Redirecting to dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-surface rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-text-default mb-2">
            Accept Family Invitation
          </h1>
          <p className="text-text-secondary">
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
            <p className="text-text-secondary">
              Invalid invitation link. Please check your email for the correct link.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              type="text"
              id="name"
              label="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Enter your full name"
              disabled={isSubmitting}
              helpText="This name will be visible to other family members"
            />

            <Input
              type="password"
              id="password"
              label="Password (Optional)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password"
              disabled={isSubmitting}
              helpText="Leave blank to use email-based authentication"
            />

            {password && (
              <Input
                type="password"
                id="confirmPassword"
                label="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                disabled={isSubmitting}
              />
            )}

            <div className="flex flex-col items-center space-y-4">
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
            </div>
          </form>
        )}

        <div className="mt-6 flex flex-col items-center">
          <p className="text-sm text-text-secondary text-center">
            By accepting, you agree to collaborate with your family members
          </p>
        </div>
      </div>
    </div>
  );
}

export default function AcceptInvitationPage() {
  return (
    <Suspense fallback={<PageLoading message="Loading..." />}>
      <AcceptInvitationContent />
    </Suspense>
  );
}

