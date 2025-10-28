import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Manrope } from 'next/font/google';
import { getUser, getTeamForUser } from '@/lib/db/queries';
import Providers from '@/app/providers';

// ============================================================================
// Font Configuration
// ============================================================================

const manrope = Manrope({ subsets: ['latin'] });

// ============================================================================
// Metadata & Viewport Configuration
// ============================================================================

export const metadata: Metadata = {
  title: 'Next.js SaaS Starter',
  description: 'Get started quickly with Next.js, Postgres, and Stripe.'
};

export const viewport: Viewport = {
  maximumScale: 1
};

// ============================================================================
// CSS Classes
// ============================================================================

const htmlClasses = [
  'bg-white dark:bg-gray-950',
  'text-black dark:text-white',
  manrope.className
].join(' ');

const bodyClasses = 'min-h-[100dvh] bg-gray-50';

// ============================================================================
// Root Layout Component
// ============================================================================

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className={htmlClasses}>
      <body className={bodyClasses}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
