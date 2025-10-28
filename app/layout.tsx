import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Manrope } from 'next/font/google';
import { SWRProvider } from '@/components/providers/swr-provider';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { ErrorBoundary } from '@/components/error-boundary';

export const metadata: Metadata = {
  title: {
    default: 'Next.js SaaS Starter',
    template: '%s | Next.js SaaS Starter'
  },
  description: 'Get started quickly with Next.js, Postgres, and Stripe. A modern SaaS starter template with authentication, payments, and more.',
  keywords: ['Next.js', 'SaaS', 'Stripe', 'Postgres', 'TypeScript', 'Tailwind CSS'],
  authors: [{ name: 'Anysphere Inc.' }],
  creator: 'Anysphere Inc.',
  publisher: 'Anysphere Inc.',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: 'Next.js SaaS Starter',
    description: 'Get started quickly with Next.js, Postgres, and Stripe. A modern SaaS starter template with authentication, payments, and more.',
    siteName: 'Next.js SaaS Starter',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Next.js SaaS Starter',
    description: 'Get started quickly with Next.js, Postgres, and Stripe. A modern SaaS starter template with authentication, payments, and more.',
    creator: '@anysphere',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
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
  variable: '--font-manrope',
  preload: true,
});

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} bg-white dark:bg-gray-950 text-black dark:text-white`}
      suppressHydrationWarning
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-[100dvh] bg-gray-50 antialiased">
        <ErrorBoundary>
          <ThemeProvider
            defaultTheme="system"
            storageKey="ui-theme"
          >
            <SWRProvider>
              {children}
            </SWRProvider>
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
