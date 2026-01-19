/**
 * Create Family Page
 */

'use client';

import { useRouter } from 'next/navigation';
import CreateFamilyForm from '@/components/family/CreateFamilyForm';
import { PageContainer } from '@/components/common';
import { Text } from '@/components/common/Text/Text';
import { getUserContext, setUserContext } from '@/lib/auth';
import type { Family } from '@/types/entities';

export default function CreateFamilyPage() {
  const router = useRouter();

  const handleSuccess = (family: Family) => {
    const userContext = getUserContext();
    if (userContext) {
      setUserContext({
        ...userContext,
        familyId: family.familyId,
        role: 'admin',
      });
    }
    router.replace('/dashboard');
  };

  return (
    <PageContainer>
      <div className="mx-auto max-w-2xl">
        <div className="bg-surface shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h1 className="text-lg font-medium text-text-default">
              Create your family
            </h1>
            <Text variant="bodySmall" color="primary" className="mt-2">
              Start a new family account to manage your inventory and invite others.
            </Text>
            <div className="mt-5">
              <CreateFamilyForm onSuccess={handleSuccess} />
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
