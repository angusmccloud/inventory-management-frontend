'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/common/Card/Card';
import { Button } from '@/components/common/Button/Button';
import { Alert } from '@/components/common/Alert/Alert';
import { Text } from '@/components/common/Text/Text';
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

export default function DashboardManager({ familyId, onCreateNew, onEdit }: DashboardManagerProps) {
  // @ts-ignore - dashboards is used in renderListView  
  const [dashboards, setDashboards] = useState<DashboardListItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

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

  const handleCopyUrl = async (url: string): Promise<void> => {
    try {
      await navigator.clipboard.writeText(url);
      setSuccessMessage('URL copied to clipboard!');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error('Failed to copy URL:', err);
      setError('Failed to copy URL to clipboard');
    }
  };

  const handleEditDashboard = (dashboardId: string): void => {
    onEdit?.(dashboardId);
  };

  // @ts-ignore - handleDeleteDashboard is used in renderListView
  const handleDeleteDashboard = async (dashboardId: string): Promise<void> => {
    if (!confirm('Are you sure you want to delete this dashboard?')) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await deleteDashboard(dashboardId);
      setSuccessMessage('Dashboard deleted successfully');
      await loadDashboards();
    } catch (err) {
      console.error('Failed to delete dashboard:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete dashboard');
    } finally {
      setLoading(false);
    }
  };

  // @ts-ignore - handleRotateUrl is used in renderListView  
  const handleRotateUrl = async (dashboardId: string): Promise<void> => {
    if (!confirm('This will deactivate the current URL and generate a new one. Continue?')) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const result = await rotateDashboard(dashboardId);
      const newUrl = `${window.location.origin}/d/${result.newDashboardId}`;
      setSuccessMessage(`URL rotated successfully! New URL: ${newUrl}`);
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
      {successMessage && <Alert severity="success">{successMessage}</Alert>}

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <Text variant="body" color="secondary" className="mt-2">Loading dashboards...</Text>
        </div>
      ) : dashboards.length === 0 ? (
        <Card elevation="low" padding="lg">
          <div className="text-center py-8">
            <Text variant="body" color="secondary" className="mb-4">
              You haven't created any dashboards yet.
            </Text>
            <Button variant="primary" onClick={() => setView('create')}>
              Create Your First List
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {dashboards.map((dashboard) => (
            <Card key={dashboard.dashboardId} elevation="low" padding="md" interactive>
              <h3 className="text-lg font-semibold text-text-primary mb-2">
                {dashboard.title}
              </h3>
              <div className="text-xs mb-3">
                <Text variant="caption" color="secondary">Type: {dashboard.type === 'location' ? 'Location-based' : 'Item-based'}</Text>
                <Text variant="caption" color="secondary">Created: {new Date(dashboard.createdAt).toLocaleDateString()}</Text>
                <Text variant="caption" color="secondary">Accessed: {dashboard.accessCount} times</Text>
              </div>
              <div className="flex flex-col gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleCopyUrl(`${window.location.origin}/d/${dashboard.dashboardId}`)}
                >
                  Copy URL
                </Button>
                <div className="flex justify-between gap-2">
                  <Button
                    variant="warning"
                    size="sm"
                    onClick={() => handleRotateUrl(dashboard.dashboardId)}
                  >
                    Rotate URL
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleEditDashboard(dashboard.dashboardId)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDeleteDashboard(dashboard.dashboardId)}
                  >
                    Delete
                  </Button>
                </div>
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
    </div>
  );
}
