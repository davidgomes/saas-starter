import './globals.css';
import type { Metadata, Viewport } from 'next';
import { manrope } from '@/lib/utils/font';
import { metadata as siteMetadata, viewport as siteViewport } from '@/lib/utils/metadata';
import { SWRProvider } from '@/components/providers/swr-provider';
import { getUser, getTeamForUser } from '@/lib/db/queries';

export const metadata: Metadata = siteMetadata;
export const viewport: Viewport = siteViewport;

const HTML_CLASS_NAME = `bg-white dark:bg-gray-950 text-black dark:text-white`;
const BODY_CLASS_NAME = `min-h-[100dvh] bg-gray-50`;

interface RootLayoutProps {
  children: React.ReactNode;
}

/**
 * Root layout component for the entire application
 * Configures:
 * - Global styles and fonts
 * - Dark mode support
 * - SWR configuration for data fetching
 */
export default async function RootLayout({ children }: RootLayoutProps) {
  // Fetch initial data for SWR fallback
  // These promises are resolved server-side before rendering
  const swrFallback = {
    '/api/user': getUser(),
    '/api/team': getTeamForUser()
  };

  return (
    <html lang="en" className={`${HTML_CLASS_NAME} ${manrope.className}`}>
      <body className={BODY_CLASS_NAME}>
        <SWRProvider fallback={swrFallback}>
          {children}
        </SWRProvider>
      </body>
    </html>
  );
}
