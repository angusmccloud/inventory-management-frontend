'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SuggestionList } from '@/components/suggestions/SuggestionList';
import { Button, Text, Card, PageLoading, TabNavigation } from '@/components/common';
import { getUserContext } from '@/lib/auth';
import { listUserFamilies } from '@/lib/api/families';
import type { Tab } from '@/components/common/TabNavigation/TabNavigation.types';

export default function SuggestionsPage() {
  const router = useRouter();
  // T024/T025: Use string type compatible with TabNavigation
  const [statusFilter, setStatusFilter] = useState<string>('pending');
  const [familyId, setFamilyId] = useState<string>('');
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  
  // Define tabs for TabNavigation
  const filterTabs: Tab[] = [
    { id: 'pending', label: 'Pending' },
    { id: 'approved', label: 'Approved' },
    { id: 'rejected', label: 'Rejected' },
    { id: 'all', label: 'All' },
  ];

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
    return <PageLoading message="Loading suggestions..." fullHeight={false} />;
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
          <Button variant="primary" onClick={() => router.push('/suggestions/suggest')}>
            Create Suggestion
          </Button>
        )}
      </div>

      {/* Filter Tabs - T024/T025: Replace toggle buttons with TabNavigation + responsiveMode='auto' */}
      <Card className="mb-6">
        <TabNavigation
          tabs={filterTabs}
          activeTab={statusFilter}
          onChange={(tabId) => {
            // Convert 'all' tab to undefined for SuggestionList
            setStatusFilter(tabId);
          }}
          responsiveMode="auto"
        />
      </Card>

      {/* Suggestions List */}
      <SuggestionList
        familyId={familyId}
        isAdmin={isAdmin}
        statusFilter={statusFilter === 'all' ? undefined : statusFilter as 'pending' | 'approved' | 'rejected'}
        onSuggestionUpdate={handleSuggestionUpdate}
      />
    </div>
  );
}
