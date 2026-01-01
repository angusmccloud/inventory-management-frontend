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
  
  /**
   * Optional additional CSS classes
   */
  className?: string;
}

export function PageContainer({ children, className = '' }: PageContainerProps) {
  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className={`mx-auto max-w-7xl ${className}`.trim()}>
        {children}
      </div>
    </div>
  );
}

export default PageContainer;
