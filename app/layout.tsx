import type { Metadata, Viewport } from 'next';
import './globals.css';
import ThemeProvider from '@/components/common/ThemeProvider';
import { SnackbarProvider } from '@/contexts/SnackbarContext';

export const metadata: Metadata = {
  title: 'Inventory HQ',
  description:
    'Manage your household inventory, shopping lists, and notifications with your family',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#FFFFFF', // Match light mode background color
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
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
      <body className="min-h-screen bg-background text-text-default antialiased">
        <ThemeProvider>
          <SnackbarProvider>{children}</SnackbarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
