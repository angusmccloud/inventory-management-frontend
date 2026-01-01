/**
 * Dialog Component
 * 
 * Reusable confirmation and alert dialog.
 */

'use client';

export interface DialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  type?: 'confirm' | 'alert' | 'error';
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function Dialog({
  isOpen,
  title,
  message,
  type = 'confirm',
  confirmLabel = 'OK',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
}: DialogProps) {
  if (!isOpen) return null;

  const isConfirm = type === 'confirm';
  const isError = type === 'error';

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
            <div className={`mx-auto flex h-12 w-12 items-center justify-center rounded-full ${
              isError ? 'bg-error/10' : 'bg-primary/10'
            }`}>
              {isError ? (
                <svg
                  className="h-6 w-6 text-error"
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
                  className="h-6 w-6 text-primary"
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
                <p className="text-sm text-text-secondary">{message}</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className={`mt-5 sm:mt-6 ${isConfirm ? 'sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3' : ''}`}>
            {isConfirm ? (
              <>
                <button
                  type="button"
                  onClick={onConfirm}
                  className={`inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 sm:col-start-2 ${
                    isError
                      ? 'bg-error text-error-contrast hover:opacity-90 focus:ring-error'
                      : 'bg-primary text-primary-contrast hover:bg-primary-hover focus:ring-primary'
                  }`}
                >
                  {confirmLabel}
                </button>
                <button
                  type="button"
                  onClick={onCancel}
                  className="mt-3 inline-flex w-full justify-center rounded-md bg-surface px-3 py-2 text-sm font-semibold text-text-primary shadow-sm ring-1 ring-inset ring-border hover:bg-surface-hover sm:col-start-1 sm:mt-0"
                >
                  {cancelLabel}
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={onConfirm}
                className={`inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  isError
                    ? 'bg-error text-error-contrast hover:opacity-90 focus:ring-error'
                    : 'bg-primary text-primary-contrast hover:bg-primary-hover focus:ring-primary'
                }`}
              >
                {confirmLabel}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

