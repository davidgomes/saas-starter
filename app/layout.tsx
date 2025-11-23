import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Manrope } from 'next/font/google';
import { getUser, getTeamForUser } from '@/lib/db/queries';
import { SWRConfig } from 'swr';

export const metadata: Metadata = {
  title: 'Next.js SaaS Starter',
  description: 'Get started quickly with Next.js, Postgres, and Stripe.',
  keywords: ['Next.js', 'SaaS', 'Stripe', 'PostgreSQL', 'TypeScript'],
  authors: [{ name: 'Anysphere Inc.' }],
  creator: 'Anysphere Inc.',
  publisher: 'Anysphere Inc.',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://example.com',
    title: 'Next.js SaaS Starter',
    description: 'Get started quickly with Next.js, Postgres, and Stripe.',
    siteName: 'Next.js SaaS Starter',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Next.js SaaS Starter',
    description: 'Get started quickly with Next.js, Postgres, and Stripe.',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: '#030712' }
  ],
};

const manrope = Manrope({ 
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'arial']
});

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`bg-white dark:bg-gray-950 text-black dark:text-white ${manrope.className}`}
      suppressHydrationWarning
    >
      <body className="min-h-[100dvh] bg-gray-50 antialiased">
        <SWRConfig
          value={{
            fallback: {
              // We do NOT await here
              // Only components that read this data will suspend
              '/api/user': getUser(),
              '/api/team': getTeamForUser()
            },
            revalidateOnFocus: false,
            revalidateOnReconnect: true,
            refreshInterval: 0,
            dedupingInterval: 2000,
          }}
        >
          {children}
        </SWRConfig>
      </body>
    </html>
  );
}
