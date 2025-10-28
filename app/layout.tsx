import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Manrope } from 'next/font/google';
import { Providers } from '@/components/providers';
import { ErrorBoundary } from '@/components/error-boundary';
import { ThemeProvider } from '@/components/theme-provider';
import { generateSkipLinks, layoutClasses, fontVariables } from '@/lib/layout-utils';

export const metadata: Metadata = {
  title: {
    default: 'Next.js SaaS Starter',
    template: '%s | Next.js SaaS Starter'
  },
  description: 'Get started quickly with Next.js, Postgres, and Stripe. A modern SaaS starter template with authentication, payments, and more.',
  keywords: ['Next.js', 'SaaS', 'Starter', 'Template', 'React', 'TypeScript', 'Postgres', 'Stripe'],
  authors: [{ name: 'Anysphere Inc.' }],
  creator: 'Anysphere Inc.',
  publisher: 'Anysphere Inc.',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: 'Next.js SaaS Starter',
    description: 'Get started quickly with Next.js, Postgres, and Stripe.',
    siteName: 'Next.js SaaS Starter',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Next.js SaaS Starter',
    description: 'Get started quickly with Next.js, Postgres, and Stripe.',
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
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#030712' },
  ],
};

const manrope = Manrope({ 
  subsets: ['latin'],
  display: 'swap',
  variable: fontVariables.manrope,
  preload: true,
});

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const skipLinks = generateSkipLinks();

  return (
    <html
      lang="en"
      className={`${manrope.variable} ${manrope.className}`}
      suppressHydrationWarning
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
      </head>
      <body 
        className={layoutClasses.body}
        suppressHydrationWarning
      >
        {/* Skip links for accessibility */}
        <div className="sr-only focus-within:not-sr-only">
          {skipLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="block p-2 bg-blue-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {link.text}
            </a>
          ))}
        </div>
        
        <ErrorBoundary>
          <ThemeProvider>
            <Providers>
              {children}
            </Providers>
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
