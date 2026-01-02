/**
 * Snackbar Context
 * 
 * Provides global snackbar notification system that can be triggered from any component.
 */

'use client';

import * as React from 'react';

export type SnackbarVariant = 'info' | 'success' | 'warning' | 'error';

export interface SnackbarConfig {
  /**
   * Message variant (maps to Alert severity)
   */
  variant: SnackbarVariant;
  
  /**
   * Message text to display
   */
  text: string;
  
  /**
   * Whether to auto-hide the snackbar
   * @default true
   */
  autoHide?: boolean;
  
  /**
   * Duration in milliseconds before auto-hiding
   * @default 5000
   */
  autoHideDuration?: number;
}

interface SnackbarContextValue {
  /**
   * Show a snackbar notification
   */
  showSnackbar: (config: SnackbarConfig) => void;
  
  /**
   * Hide the current snackbar
   */
  hideSnackbar: () => void;
}

const SnackbarContext = React.createContext<SnackbarContextValue | undefined>(undefined);

interface SnackbarState extends SnackbarConfig {
  isOpen: boolean;
}

export const SnackbarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [snackbar, setSnackbar] = React.useState<SnackbarState>({
    isOpen: false,
    variant: 'info',
    text: '',
    autoHide: true,
    autoHideDuration: 5000,
  });
  
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  
  const showSnackbar = React.useCallback((config: SnackbarConfig) => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    
    const autoHide = config.autoHide ?? true;
    const autoHideDuration = config.autoHideDuration ?? 5000;
    
    setSnackbar({
      isOpen: true,
      variant: config.variant,
      text: config.text,
      autoHide,
      autoHideDuration,
    });
    
    // Set auto-hide timeout if enabled
    if (autoHide) {
      timeoutRef.current = setTimeout(() => {
        setSnackbar((prev) => ({ ...prev, isOpen: false }));
        timeoutRef.current = null;
      }, autoHideDuration);
    }
  }, []);
  
  const hideSnackbar = React.useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setSnackbar((prev) => ({ ...prev, isOpen: false }));
  }, []);
  
  // Cleanup timeout on unmount
  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);
  
  const value = React.useMemo(
    () => ({ showSnackbar, hideSnackbar }),
    [showSnackbar, hideSnackbar]
  );
  
  return (
    <SnackbarContext.Provider value={value}>
      {children}
      {/* Snackbar component will be imported and rendered here */}
      <SnackbarComponent snackbar={snackbar} onClose={hideSnackbar} />
    </SnackbarContext.Provider>
  );
};

/**
 * Hook to access snackbar context
 */
export const useSnackbar = (): SnackbarContextValue => {
  const context = React.useContext(SnackbarContext);
  if (!context) {
    throw new Error('useSnackbar must be used within a SnackbarProvider');
  }
  return context;
};

/**
 * Snackbar Component (internal)
 * Rendered by the provider at the app root level
 */
const SnackbarComponent: React.FC<{
  snackbar: SnackbarState;
  onClose: () => void;
}> = ({ snackbar, onClose }) => {
  // Lazy import Alert to avoid circular dependencies
  const Alert = React.lazy(() => import('@/components/common/Alert/Alert'));
  
  if (!snackbar.isOpen) {
    return null;
  }
  
  return (
    <div
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4 animate-in slide-in-from-bottom-2 duration-300"
      role="region"
      aria-label="Notification"
    >
      <React.Suspense fallback={null}>
        <Alert
          severity={snackbar.variant}
          dismissible
          onDismiss={onClose}
          className="shadow-lg bg-surface"
        >
          {snackbar.text}
        </Alert>
      </React.Suspense>
    </div>
  );
};
