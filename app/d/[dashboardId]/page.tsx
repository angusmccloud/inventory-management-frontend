import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import DashboardView from '@/components/dashboard/DashboardView';

interface DashboardPageProps {
  params: {
    dashboardId: string;
  };
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Inventory Dashboard',
    description: 'View real-time inventory status',
  };
}

export default async function DashboardPage({ params }: DashboardPageProps) {
  const { dashboardId } = params;

  // Basic validation of dashboard ID format
  if (!dashboardId || dashboardId.length < 20) {
    notFound();
  }

  return <DashboardView dashboardId={dashboardId} />;
}
