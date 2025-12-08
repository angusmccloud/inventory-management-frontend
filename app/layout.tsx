import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Family Inventory Management',
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
      <body className="min-h-screen bg-gray-50 antialiased">
        {children}
      </body>
    </html>
  );
}
