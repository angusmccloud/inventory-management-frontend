/**
 * Landing Page - Inventory HQ
 * 
 * Public home page with authentication options
 */

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';
import { Link } from '@/components/common';

export default function Home() {
  const router = useRouter();
  
  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (isAuthenticated()) {
      router.push('/dashboard');
    }
  }, [router]);
  
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="max-w-4xl w-full space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-gray-100">
            Inventory HQ
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Keep track of household items, manage shopping lists, and coordinate with your family - all in one place.
          </p>
        </div>
        
        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mt-12">
          <FeatureCard
            icon="📦"
            title="Track Inventory"
            description="Monitor quantities, set low-stock alerts, and organize items by location"
          />
          <FeatureCard
            icon="🛒"
            title="Shopping Lists"
            description="Create and manage shopping lists organized by store"
          />
          <FeatureCard
            icon="👨‍👩‍👧‍👦"
            title="Family Collaboration"
            description="Share access with family members with role-based permissions"
          />
        </div>
        
        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
          <Link
            href="/login"
            className="px-8 py-3 bg-primary text-primary-contrast font-semibold rounded-lg hover:bg-primary-hover transition-colors text-center"
          >
            Sign In / Create Account
          </Link>
        </div>
        
        {/* Key Benefits */}
        <div className="mt-16 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 text-center">
            Why Choose Our System?
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <BenefitItem
              title="Reduce Food Waste"
              description="Track expiration dates and quantities to minimize waste"
            />
            <BenefitItem
              title="Save Time"
              description="No more forgotten items or duplicate purchases"
            />
            <BenefitItem
              title="Stay Organized"
              description="Know exactly what you have and where it's stored"
            />
            <BenefitItem
              title="Coordinate Easily"
              description="Real-time updates keep everyone on the same page"
            />
          </div>
        </div>
      </div>
    </main>
  );
}

/**
 * Feature card component
 */
function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center space-y-3">
      <div className="text-4xl">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
      <p className="text-gray-600 dark:text-gray-400">{description}</p>
    </div>
  );
}

/**
 * Benefit item component
 */
function BenefitItem({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start space-x-3">
      <div className="flex-shrink-0">
        <svg
          className="h-6 w-6 text-blue-600"
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
      <div>
        <h4 className="font-semibold text-gray-900 dark:text-gray-100">{title}</h4>
        <p className="text-gray-600 dark:text-gray-400 text-sm">{description}</p>
      </div>
    </div>
  );
}
