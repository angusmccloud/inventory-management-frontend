import type { Metadata, Viewport } from 'next';
import './globals.css';
import ThemeProvider from '@/components/common/ThemeProvider';

export const metadata: Metadata = {
  title: 'Inventory HQ',
  description: 'Manage your household inventory, shopping lists, and notifications with your family',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0A3315', // Updated to match primary color from theme
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased bg-background text-text-default">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
