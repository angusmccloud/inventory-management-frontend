'use client';

import { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Card } from '@/components/common/Card/Card';
import { Button } from '@/components/common/Button/Button';
import { Alert } from '@/components/common/Alert/Alert';
import { Text } from '@/components/common/Text/Text';
import Dialog from '@/components/common/Dialog';
import { PageLoading } from '@/components/common/PageLoading/PageLoading';
import { useSnackbar } from '@/contexts/SnackbarContext';
import { 
  listDashboards, 
  deleteDashboard, 
  rotateDashboard 
} from '@/lib/api/dashboards';
import { 
  DashboardListItem
} from '@/types/dashboard';

interface DashboardManagerProps {
  familyId: string;
  onCreateNew?: () => void;
  onEdit?: (dashboardId: string) => void;
}

export interface DashboardManagerRef {
  reloadDashboards: () => Promise<void>;
}

type DialogState =
  | { type: 'none' }
  | { type: 'rotate'; dashboardId: string }
  | { type: 'delete'; dashboardId: string };

const DashboardManager = forwardRef<DashboardManagerRef, DashboardManagerProps>(
  ({ familyId: _familyId, onCreateNew, onEdit }, ref) => {
    const { showSnackbar } = useSnackbar();
    // @ts-ignore - dashboards is used in renderListView  
    const [dashboards, setDashboards] = useState<DashboardListItem[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [dialogState, setDialogState] = useState<DialogState>({ type: 'none' });
    const [copiedDashboardId, setCopiedDashboardId] = useState<string | null>(null);

    // Load dashboards on component mount
    useEffect(() => {
      loadDashboards();
    }, []);

    const loadDashboards = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const data = await listDashboards(false); // exclude inactive
      
      // Sort dashboards by name ascending (T081)
      const sortedData = data.sort((a, b) => a.title.localeCompare(b.title));
      
      setDashboards(sortedData);
    } catch (err) {
      console.error('Failed to load dashboards:', err);
      setError(err instanceof Error ? err.message : 'Failed to load dashboards');
    } finally {
      setLoading(false);
    }
  };

  // Expose reloadDashboards method via ref
  useImperativeHandle(ref, () => ({
    reloadDashboards: loadDashboards
  }));

  const handleCopyUrl = async (url: string, dashboardId?: string): Promise<void> => {
    try {
      await navigator.clipboard.writeText(url);

      if (dashboardId) {
        setCopiedDashboardId(dashboardId);
        setTimeout(() => setCopiedDashboardId(null), 2000);
      }

      showSnackbar({
        variant: 'success',
        text: 'URL copied to clipboard!'
      });
    } catch (err) {
      console.error('Failed to copy URL:', err);
      setError('Failed to copy URL to clipboard');
    }
  };

  const handleEditDashboard = (dashboardId: string): void => {
    onEdit?.(dashboardId);
  };

  // @ts-ignore - handleDeleteDashboard is used in renderListView
  const handleDeleteDashboard = (dashboardId: string): void => {
    setDialogState({ type: 'delete', dashboardId });
  };

  const confirmDelete = async (): Promise<void> => {
    if (dialogState.type !== 'delete') return;

    const dashboardId = dialogState.dashboardId;
    setDialogState({ type: 'none' });

    try {
      setLoading(true);
      setError(null);
      await deleteDashboard(dashboardId);
      showSnackbar({
        variant: 'success',
        text: 'List deleted successfully'
      });
      await loadDashboards();
    } catch (err) {
      console.error('Failed to delete dashboard:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete dashboard');
    } finally {
      setLoading(false);
    }
  };

  // @ts-ignore - handleRotateUrl is used in renderListView  
  const handleRotateUrl = (dashboardId: string): void => {
    setDialogState({ type: 'rotate', dashboardId });
  };

  const confirmRotateUrl = async (): Promise<void> => {
    if (dialogState.type !== 'rotate') return;

    const dashboardId = dialogState.dashboardId;
    setDialogState({ type: 'none' });

    try {
      setLoading(true);
      setError(null);
      const result = await rotateDashboard(dashboardId);
      const newUrl = `${window.location.origin}/d/${result.newDashboard.dashboardId}`;
      showSnackbar({
        variant: 'success',
        text: `URL rotated successfully! New URL: ${newUrl}`
      });
      await loadDashboards();
    } catch (err) {
      console.error('Failed to rotate URL:', err);
      setError(err instanceof Error ? err.message : 'Failed to rotate URL');
    } finally {
      setLoading(false);
    }
  };

  // Render dashboard list view
  const renderListView = (): React.ReactElement => (
    <div className="space-y-6 mt-6">
      {error && <Alert severity="error">{error}</Alert>}

      {loading ? (
        <PageLoading message="Loading Lists..." fullHeight={false} />
      ) : dashboards.length === 0 ? (
        <Card elevation="low" padding="lg">
          <div className="text-center py-8">
            <Text variant="body" color="secondary" className="mb-4">
              You haven't created any dashboards yet.
            </Text>
            {onCreateNew && (
              <Button variant="primary" onClick={onCreateNew}>
                Create Your First List
              </Button>
            )}
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {dashboards.map((dashboard) => (
            <Card key={dashboard.dashboardId} elevation="low" padding="md" interactive>
              <h3 className="text-lg font-semibold text-text-primary mb-2">
                {dashboard.title}
              </h3>
              
              {/* Main content area with info on left and Copy URL button on right */}
              <div className="flex gap-3 mb-3">
                {/* Left side: Info fields */}
                <div className="flex-1 text-xs space-y-1">
                  <Text variant="caption" color="secondary">Type: {dashboard.type === 'location' ? 'Location-based' : 'Item-based'}</Text>
                  <Text variant="caption" color="secondary">Created: {new Date(dashboard.createdAt).toLocaleDateString()}</Text>
                  <Text variant="caption" color="secondary">Last Accessed: {dashboard.lastAccessedAt ? new Date(dashboard.lastAccessedAt).toLocaleDateString() : 'Never'}</Text>
                  <Text variant="caption" color="secondary">Accessed: {dashboard.accessCount} times</Text>
                </div>
                
                {/* Right side: Large Copy URL button */}
                <Button
                  variant="secondary"
                  onClick={() => handleCopyUrl(`${window.location.origin}/d/${dashboard.dashboardId}`, dashboard.dashboardId)}
                  className="flex-shrink-0 w-24 h-24 !p-0"
                  aria-label="Copy URL"
                >
                  <div className="flex flex-col items-center justify-center gap-1 h-full">
                    {copiedDashboardId === dashboard.dashboardId ? (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-xs font-medium">Copied!</span>
                      </>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
                        </svg>
                        <span className="text-xs font-medium">Copy URL</span>
                      </>
                    )}
                  </div>
                </Button>
              </div>
              
              {/* Bottom action buttons - equally sized */}
              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleEditDashboard(dashboard.dashboardId)}
                  className="w-full"
                >
                  Edit
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleRotateUrl(dashboard.dashboardId)}
                  className="w-full"
                >
                  Rotate URL
                </Button>
                <Button
                  variant="warning"
                  size="sm"
                  onClick={() => handleDeleteDashboard(dashboard.dashboardId)}
                  className="w-full"
                >
                  Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto">
      {renderListView()}

      {/* Rotate URL Confirmation Dialog */}
      {dialogState.type === 'rotate' && (
        <Dialog
          isOpen={true}
          type="warning"
          title="Rotate URL"
          message="This will deactivate the current URL and generate a new one. Continue?"
          confirmLabel="Rotate"
          cancelLabel="Cancel"
          onConfirm={confirmRotateUrl}
          onCancel={() => setDialogState({ type: 'none' })}
        />
      )}

      {/* Delete Dashboard Confirmation Dialog */}
      {dialogState.type === 'delete' && (
        <Dialog
          isOpen={true}
          type="warning"
          title="Delete List"
          message="Are you sure you want to delete this list? This cannot be undone."
          confirmLabel="Delete"
          cancelLabel="Cancel"
          onConfirm={confirmDelete}
          onCancel={() => setDialogState({ type: 'none' })}
        />
      )}
    </div>
  );
});

DashboardManager.displayName = 'DashboardManager';

export default DashboardManager;
