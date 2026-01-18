import type { Metadata, Viewport } from 'next';
import './globals.css';
import ThemeProvider from '@/components/common/ThemeProvider';
import { SnackbarProvider } from '@/contexts/SnackbarContext';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#FFFFFF', // Match light mode background color
};

export const metadata: Metadata = {
  title: {
    default: "Inventory HQ",
    template: "%s | Inventory HQ",
  },
  description:
    "Inventory HQ is a simple inventory management app for tracking items, stock, and availability.",

  metadataBase: new URL("https://inventoryhq.io"),

  openGraph: {
    type: "website",
    url: "https://inventoryhq.io",
    title: "Inventory HQ",
    description:
      "Inventory HQ is a simple inventory management app for tracking items, stock, and availability.",
    siteName: "Inventory HQ",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Inventory HQ",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Inventory HQ",
    description:
      "Inventory HQ is a simple inventory management app for tracking items, stock, and availability.",
    images: ["/og-image.png"],
  },

  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },

  manifest: "/site.webmanifest",
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
