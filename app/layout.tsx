import type { Metadata } from 'next';
import './globals.css';
import ThemeProvider from '@/components/common/ThemeProvider';

export const metadata: Metadata = {
  title: 'Inventory HQ',
  description: 'Manage your household inventory, shopping lists, and notifications with your family',
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#3b82f6',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
