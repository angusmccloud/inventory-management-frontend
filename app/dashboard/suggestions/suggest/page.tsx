'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { SuggestionForm, SuggestionFormData } from '@/components/suggestions/SuggestionForm';
import { Text, Card } from '@/components/common';
import { createSuggestion } from '@/lib/api/suggestions';
import { getUserContext } from '@/lib/auth';
import { listUserFamilies } from '@/lib/api/families';

export default function SuggestPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [familyId, setFamilyId] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  // Pre-fill from query params (when coming from inventory "Suggest" button)
  const prefilledItemId = searchParams.get('itemId') || undefined;
  const prefilledItemName = searchParams.get('itemName') || undefined;

  useEffect(() => {
    loadFamilyId();
  }, []);

  const loadFamilyId = async (): Promise<void> => {
    try {
      const userContext = getUserContext();
      
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

  const handleSubmit = async (data: SuggestionFormData) => {
    try {
      setIsSubmitting(true);
      setError(null);

      await createSuggestion(familyId, data);

      // Show success toast (TODO: integrate toast system)
      console.log('Suggestion created successfully!');

      // Redirect to suggestions list
      router.push('/dashboard/suggestions');
    } catch (err) {
      if (err instanceof Error) {
        // Handle specific error cases
        if (err.message.includes('403')) {
          setError('You do not have permission to create suggestions. Please contact your family admin.');
        } else if (err.message.includes('404')) {
          setError('The selected item no longer exists. Please refresh and try again.');
        } else if (err.message.includes('422')) {
          setError('Invalid suggestion data. Please check your inputs and try again.');
        } else {
          setError(err.message || 'Failed to create suggestion. Please try again.');
        }
      }
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <Text variant="body" className="text-gray-600 dark:text-gray-400">
          Loading...
        </Text>
      </div>
    );
  }

  if (!familyId) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <Card className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
          <Text variant="body" className="text-red-600 dark:text-red-400">
            {error || 'Unable to load family information'}
          </Text>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-6">
        <Text variant="h1" className="mb-2">
          Create Suggestion
        </Text>
        <Text variant="body" className="text-gray-600 dark:text-gray-400">
          Suggest adding an item to the shopping list or creating a new inventory item.
        </Text>
      </div>

      {error && (
        <Card className="mb-6 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
          <Text variant="body" className="text-red-600 dark:text-red-400">
            {error}
          </Text>
        </Card>
      )}

      <SuggestionForm
        familyId={familyId}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        prefilledItemId={prefilledItemId}
        prefilledItemName={prefilledItemName}
      />
    </div>
  );
}
