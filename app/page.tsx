/**
 * Landing Page - Family Inventory Management System
 * 
 * Public home page with authentication options
 */

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';

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
          <h1 className="text-5xl font-bold text-gray-900">
            Family Inventory Management
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
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
          <a
            href="/login"
            className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors text-center"
          >
            Sign In
          </a>
          <a
            href="/register"
            className="px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg border-2 border-blue-600 hover:bg-blue-50 transition-colors text-center"
          >
            Create Account
          </a>
        </div>
        
        {/* Key Benefits */}
        <div className="mt-16 bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
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
    <div className="bg-white rounded-lg shadow-md p-6 text-center space-y-3">
      <div className="text-4xl">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
      <p className="text-gray-600">{description}</p>
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
        <h4 className="font-semibold text-gray-900">{title}</h4>
        <p className="text-gray-600 text-sm">{description}</p>
      </div>
    </div>
  );
}
