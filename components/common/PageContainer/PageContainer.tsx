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

// One spot for styling content wrapper, but not needed right now.
export function PageContainer({ children }: PageContainerProps) {
  return <div>{children}</div>;
}

export default PageContainer;
