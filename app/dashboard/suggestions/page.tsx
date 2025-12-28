'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SuggestionList } from '@/components/suggestions/SuggestionList';
import { Button, Text, Card } from '@/components/common';
import { getUserContext } from '@/lib/auth';
import { listUserFamilies } from '@/lib/api/families';

export default function SuggestionsPage() {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState<'pending' | 'approved' | 'rejected' | undefined>('pending');
  const [familyId, setFamilyId] = useState<string>('');
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    loadFamilyId();
  }, []);

  const loadFamilyId = async (): Promise<void> => {
    try {
      const userContext = getUserContext();
      
      // Check user role
      if (userContext?.role === 'admin') {
        setIsAdmin(true);
      }
      
      if (userContext?.familyId) {
        // Use cached familyId from localStorage
        setFamilyId(userContext.familyId);
      } else {
        // Fetch from backend
        const families = await listUserFamilies();
        
        if (families && families.length > 0 && families[0]) {
          const userFamilyId = families[0].familyId;
          setFamilyId(userFamilyId);
          
          // Cache it in localStorage
          if (userContext && typeof window !== 'undefined') {
            userContext.familyId = userFamilyId;
            localStorage.setItem('user_context', JSON.stringify(userContext));
          }
        } else {
          setError('No family found. Please create or join a family first.');
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load family');
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestionUpdate = () => {
    // Callback for when a suggestion is approved/rejected
    console.log('Suggestion updated');
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Text variant="body">Loading...</Text>
      </div>
    );
  }

  if (!familyId || error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card>
          <Text variant="h2" className="mb-4">Error</Text>
          <Text variant="body" className="text-red-600">
            {error || 'Unable to load family information. Please try again.'}
          </Text>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Text variant="h1" className="mb-2">
            Suggestions
          </Text>
          <Text variant="body" className="text-gray-600 dark:text-gray-400">
            {isAdmin
              ? 'Review and manage suggestions from your family members.'
              : 'View your suggestions and their status.'}
          </Text>
        </div>
        {!isAdmin && (
          <Button variant="primary" onClick={() => router.push('/dashboard/suggestions/suggest')}>
            Create Suggestion
          </Button>
        )}
      </div>

      {/* Filter Tabs */}
      <Card className="mb-6">
        <div className="flex gap-2">
          <Button
            variant={statusFilter === 'pending' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setStatusFilter('pending')}
          >
            Pending
          </Button>
          <Button
            variant={statusFilter === 'approved' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setStatusFilter('approved')}
          >
            Approved
          </Button>
          <Button
            variant={statusFilter === 'rejected' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setStatusFilter('rejected')}
          >
            Rejected
          </Button>
          <Button
            variant={statusFilter === undefined ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setStatusFilter(undefined)}
          >
            All
          </Button>
        </div>
      </Card>

      {/* Suggestions List */}
      <SuggestionList
        familyId={familyId}
        isAdmin={isAdmin}
        statusFilter={statusFilter}
        onSuggestionUpdate={handleSuggestionUpdate}
      />
    </div>
  );
}
