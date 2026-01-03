/**
 * Modal Component
 *
 * Reusable modal dialog for displaying content in an overlay.
 * Features:
 * - Backdrop with click-to-close
 * - ESC key support
 * - Responsive sizing
 * - Accessible (WCAG 2.1 AA)
 */

'use client';

import { useEffect, useCallback } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  showCloseButton?: boolean;
  closeOnBackdrop?: boolean;
  closeOnEsc?: boolean;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
  closeOnBackdrop = true,
  closeOnEsc = true,
}: ModalProps) {
  // Handle ESC key
  const handleEscape = useCallback(
    (event: KeyboardEvent) => {
      if (closeOnEsc && event.key === 'Escape') {
        onClose();
      }
    },
    [closeOnEsc, onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, handleEscape]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'sm:max-w-md',
    md: 'sm:max-w-lg',
    lg: 'sm:max-w-2xl',
    xl: 'sm:max-w-4xl',
    full: 'sm:max-w-full sm:mx-4',
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center px-4 py-6 text-center sm:p-0">
        {/* Background overlay */}
        <div
          className="fixed inset-0 bg-surface/75 backdrop-blur-sm transition-opacity"
          onClick={closeOnBackdrop ? onClose : undefined}
          aria-hidden="true"
        />

        {/* Modal panel */}
        <div
          className={`relative w-full ${sizeClasses[size]} inline-block align-bottom bg-surface-elevated rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle`}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <h2
              id="modal-title"
              className="text-xl font-semibold text-text-default"
            >
              {title}
            </h2>
            {showCloseButton && (
              <button
                onClick={onClose}
                className="rounded-md p-1 hover:bg-surface transition-colors"
                aria-label="Close modal"
              >
                <XMarkIcon className="h-5 w-5 text-text-secondary" />
              </button>
            )}
          </div>

          {/* Content */}
          <div className="px-6 py-4 max-h-[calc(100vh-12rem)] overflow-y-auto">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
