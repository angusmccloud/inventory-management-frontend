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
  themeColor: '#FFFFFF', // Match light mode background color
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const theme = localStorage.getItem('theme') || 'auto';
                  if (theme === 'dark' || 
                      (theme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.classList.add('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-screen antialiased bg-background text-text-default">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
