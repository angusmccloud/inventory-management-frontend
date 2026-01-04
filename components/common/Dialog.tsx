/**
 * Dialog Component
 * 
 * Reusable confirmation and alert dialog.
 */

'use client';

import { Button } from '@/components/common/Button/Button';
import { Text } from '@/components/common/Text/Text';

export type DialogType = 'primary' | 'secondary' | 'tertiary' | 'error' | 'warning';

export interface DialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  type?: DialogType;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  /** Whether to show cancel button (defaults to true for 'primary', false for others) */
  showCancel?: boolean;
}

export default function Dialog({
  isOpen,
  title,
  message,
  type = 'primary',
  confirmLabel = 'OK',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  showCancel = true,
}: DialogProps) {
  if (!isOpen) return null;

  // Default showCancel to true for primary (confirm-style), false for others (alert-style)
  const shouldShowCancel = showCancel ?? (type === 'primary');
  
  // Map dialog type to button variant
  const buttonVariant = type === 'error' ? 'danger' : type;
  
  // Map dialog type to icon color classes
  const iconColorMap: Record<DialogType, { bg: string; text: string }> = {
    primary: { bg: 'bg-primary/10', text: 'text-primary' },
    secondary: { bg: 'bg-secondary/10', text: 'text-secondary' },
    tertiary: { bg: 'bg-tertiary/10', text: 'text-tertiary' },
    error: { bg: 'bg-error/10', text: 'text-error' },
    warning: { bg: 'bg-warning/10', text: 'text-warning' },
  };
  
  const iconColors = iconColorMap[type];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center px-4 text-center sm:p-0">
        {/* Background overlay */}
        <div
          className="fixed inset-0 bg-surface/75 backdrop-blur-sm transition-opacity"
          onClick={onCancel}
        />

        {/* Dialog panel - Feature 011-mobile-responsive-ui: 90% width on mobile */}
        <div className="relative w-[90%] max-w-full inline-block align-bottom bg-surface-elevated rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
          <div>
            {/* Icon */}
            <div className={`mx-auto flex h-12 w-12 items-center justify-center rounded-full ${iconColors.bg}`}>
              {type === 'error' || type === 'warning' ? (
                <svg
                  className={`h-6 w-6 ${iconColors.text}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                  />
                </svg>
              ) : (
                <svg
                  className={`h-6 w-6 ${iconColors.text}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
                  />
                </svg>
              )}
            </div>

            {/* Content */}
            <div className="mt-3 text-center sm:mt-5">
              <h3 className="text-lg font-semibold leading-6 text-text-primary">
                {title}
              </h3>
              <div className="mt-2">
                <Text variant="bodySmall" color="secondary">{message}</Text>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className={`mt-5 sm:mt-6 ${shouldShowCancel ? 'sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3' : ''}`}>
            {shouldShowCancel ? (
              <>
                <div className="sm:col-start-2">
                  <Button
                    variant={buttonVariant}
                    size="sm"
                    fullWidth
                    onClick={onConfirm}
                  >
                    {confirmLabel}
                  </Button>
                </div>
                <div className="mt-3 sm:col-start-1 sm:mt-0">
                  <Button
                    variant="secondary"
                    size="sm"
                    fullWidth
                    onClick={onCancel}
                  >
                    {cancelLabel}
                  </Button>
                </div>
              </>
            ) : (
              <Button
                variant={buttonVariant}
                size="sm"
                fullWidth
                onClick={onConfirm}
              >
                {confirmLabel}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

