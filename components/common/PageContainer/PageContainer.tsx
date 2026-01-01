/**
 * PageContainer Component
 * 
 * Provides consistent padding and max-width container for all dashboard pages.
 * Ensures uniform layout across the application.
 */

import React from 'react';

export interface PageContainerProps {
  /**
   * Child content to be rendered within the container
   */
  children: React.ReactNode;
}

export function PageContainer({ children }: PageContainerProps) {
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {children}
      </div>
    </div>
  );
}

export default PageContainer;
