/**
 * Dashboard Home Page - Family Inventory Management System
 * 
 * Main dashboard with overview and family setup.
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getUserContext } from '@/lib/auth';
import { getFamily } from '@/lib/api/families';
import { Family } from '@/types/entities';
import CreateFamilyForm from '@/components/family/CreateFamilyForm';

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
    const userContext = getUserContext();
    
    if (!userContext?.familyId) {
      // No family yet, show create form
      setShowCreateFamily(true);
      setLoading(false);
      return;
    }

    try {
      const familyData = await getFamily(userContext.familyId);
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
    
    // Update user context with familyId
    const userContext = getUserContext();
    if (userContext) {
      userContext.familyId = newFamily.familyId;
      // Save updated context
      if (typeof window !== 'undefined') {
        localStorage.setItem('user_context', JSON.stringify(userContext));
      }
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  if (showCreateFamily) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-lg font-medium text-gray-900">
              Welcome! Let's create your family
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              To get started, create a family account. You'll be the administrator and can invite other family members later.
            </p>
            <div className="mt-5">
              <CreateFamilyForm onSuccess={handleFamilyCreated} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome to {family?.name || 'your family'}
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          Manage your family's inventory and shopping lists
        </p>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <button
          onClick={() => router.push('/dashboard/inventory')}
          className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-900">View Inventory</h3>
            <p className="mt-2 text-sm text-gray-500">
              See all your family's items
            </p>
          </div>
        </button>

        <button
          onClick={() => router.push('/dashboard/inventory?action=add')}
          className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-900">Add Item</h3>
            <p className="mt-2 text-sm text-gray-500">
              Add a new inventory item
            </p>
          </div>
        </button>

        <button
          disabled
          className="relative rounded-lg border border-gray-300 bg-gray-50 px-6 py-5 opacity-50"
        >
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-900">Shopping List</h3>
            <p className="mt-2 text-sm text-gray-500">
              Coming soon
            </p>
          </div>
        </button>
      </div>

      {/* Stats */}
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium text-gray-900">Family Information</h3>
          <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-gray-500">Family Name</dt>
              <dd className="mt-1 text-lg font-semibold text-gray-900">
                {family?.name}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Created</dt>
              <dd className="mt-1 text-lg font-semibold text-gray-900">
                {family?.createdAt ? new Date(family.createdAt).toLocaleDateString() : 'N/A'}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
