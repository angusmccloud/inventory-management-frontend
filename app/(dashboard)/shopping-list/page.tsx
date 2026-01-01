/**
 * Shopping List Page
 * Feature: 002-shopping-lists
 * 
 * Main page for viewing and managing family shopping list.
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getUserContext } from '@/lib/auth';
import ShoppingList from '@/components/shopping-list/ShoppingList';
import { PageLoading, PageContainer } from '@/components/common';

export default function ShoppingListPage() {
  const router = useRouter();
  const [familyId, setFamilyId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get family ID from user context
    const userContext = getUserContext();
    
    if (!userContext?.familyId) {
      // Redirect to dashboard if no family is selected
      router.push('/dashboard');
      return;
    }
    
    setFamilyId(userContext.familyId);
    setIsLoading(false);
  }, [router]);

  if (isLoading) {
    return <PageLoading message="Loading shopping list..." fullHeight={false} />;
  }

  if (!familyId) {
    return null; // Will redirect
  }

  return (
    <PageContainer>
        <ShoppingList familyId={familyId} />
    </PageContainer>
  );
}

