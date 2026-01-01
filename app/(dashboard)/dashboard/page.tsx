/**
 * Dashboard Home Page - Inventory HQ
 * 
 * Main dashboard with overview and family setup.
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getUserContext } from '@/lib/auth';
import { getFamily, listUserFamilies } from '@/lib/api/families';
import { Family } from '@/types/entities';
import CreateFamilyForm from '@/components/family/CreateFamilyForm';
import NFCStatsWidget from '@/components/dashboard/NFCStatsWidget';
import { PageLoading, PageContainer, PageHeader } from '@/components/common';

export default function DashboardPage() {
  const router = useRouter();
  const [family, setFamily] = useState<Family | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [showCreateFamily, setShowCreateFamily] = useState<boolean>(false);

  useEffect(() => {
    loadFamily();
  }, []);

  const loadFamily = async (): Promise<void> => {
    try {
      // First, fetch all families the user is a member of
      const families = await listUserFamilies();
      
      if (!families || families.length === 0 || !families[0]) {
        // No families found, show create form
        setShowCreateFamily(true);
        setLoading(false);
        return;
      }

      // Get the first family (for MVP, users can only be in one family)
      const firstFamily = families[0];
      if (!firstFamily) {
        setShowCreateFamily(true);
        setLoading(false);
        return;
      }
      
      const userFamilyId = firstFamily.familyId;
      
      // Update user context with familyId AND role from the family member relationship
      const userContext = getUserContext();
      if (userContext) {
        userContext.familyId = userFamilyId;
        userContext.role = firstFamily.role; // Store the role from the families endpoint
        if (typeof window !== 'undefined') {
          localStorage.setItem('user_context', JSON.stringify(userContext));
        }
      }

      // Fetch full family details
      const familyData = await getFamily(userFamilyId);
      setFamily(familyData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load family');
    } finally {
      setLoading(false);
    }
  };

  const handleFamilyCreated = (newFamily: Family): void => {
    setFamily(newFamily);
    setShowCreateFamily(false);
    
    // Update user context with familyId and role (creator is always admin)
    const userContext = getUserContext();
    if (userContext) {
      userContext.familyId = newFamily.familyId;
      userContext.role = 'admin'; // Creator is always admin
      // Save updated context
      if (typeof window !== 'undefined') {
        localStorage.setItem('user_context', JSON.stringify(userContext));
      }
    }
  };

  if (loading) {
    return <PageLoading message="Loading dashboard..." fullHeight={false} />;
  }

  if (showCreateFamily) {
    return (
      <PageContainer>
        <div className="max-w-2xl mx-auto">
          <div className="bg-surface shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-lg font-medium text-text-default">
                Welcome! Let's create your family
              </h2>
              <p className="mt-2 text-sm text-text-default">
                To get started, create a family account. You'll be the administrator and can invite other family members later.
              </p>
              <div className="mt-5">
                <CreateFamilyForm onSuccess={handleFamilyCreated} />
              </div>
            </div>
          </div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="space-y-6">
        <PageHeader
          title={`Welcome to ${family?.name || 'your family'}`}
          description="Manage your family's inventory and shopping lists"
        />

        {error && (
          <div className="rounded-md bg-error/10 p-4">
            <p className="text-sm text-error">{error}</p>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <button
          onClick={() => router.push('/inventory')}
          className="relative rounded-lg border border-border bg-surface px-6 py-5 shadow-sm hover:border-border dark:hover:border-border focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          <div className="text-center">
            <h3 className="text-lg font-medium text-text-default">View Inventory</h3>
            <p className="mt-2 text-sm text-text-default">
              See all your family's items
            </p>
          </div>
        </button>

        <button
          onClick={() => router.push('/inventory?action=add')}
          className="relative rounded-lg border border-border bg-surface px-6 py-5 shadow-sm hover:border-border dark:hover:border-border focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          <div className="text-center">
            <h3 className="text-lg font-medium text-text-default">Add Item</h3>
            <p className="mt-2 text-sm text-text-default">
              Add a new inventory item
            </p>
          </div>
        </button>

        <button
          onClick={() => router.push('/shopping-list')}
          className="relative rounded-lg border border-border bg-surface px-6 py-5 shadow-sm hover:border-border dark:hover:border-border focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          <div className="text-center">
            <h3 className="text-lg font-medium text-text-default">Shopping List</h3>
            <p className="mt-2 text-sm text-text-default">
              Manage your shopping list
            </p>
          </div>
        </button>
      </div>

      {/* Stats */}
      <div className="bg-surface shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium text-text-default">Family Information</h3>
          <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-text-default">Family Name</dt>
              <dd className="mt-1 text-lg font-semibold text-text-default">
                {family?.name}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-text-default">Created</dt>
              <dd className="mt-1 text-lg font-semibold text-text-default">
                {family?.createdAt ? new Date(family.createdAt).toLocaleDateString() : 'N/A'}
              </dd>
            </div>
          </dl>
        </div>
      </div>

        {/* NFC URL Statistics (Admin Only) */}
        {getUserContext()?.role === 'admin' && <NFCStatsWidget />}
      </div>
    </PageContainer>
  );
}
