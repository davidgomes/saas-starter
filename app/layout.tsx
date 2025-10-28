import './globals.css';
import { Suspense } from 'react';
import { ErrorBoundary } from '@/lib/providers';
import { ServerDataProvider } from '@/lib/providers/server-data-provider';
import { manrope } from '@/lib/fonts';
import { metadata, viewport } from '@/lib/metadata';

// Re-export metadata and viewport for Next.js
export { metadata, viewport };

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} font-sans antialiased`}
      suppressHydrationWarning
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen bg-background font-sans antialiased">
        <ErrorBoundary>
          <ServerDataProvider>
            <Suspense fallback={<LoadingFallback />}>
              {children}
            </Suspense>
          </ServerDataProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}

function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center space-y-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="text-sm text-gray-600">Loading...</p>
      </div>
    </div>
  );
}
