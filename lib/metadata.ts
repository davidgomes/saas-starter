import type { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  title: {
    default: 'Next.js SaaS Starter',
    template: '%s | Next.js SaaS Starter',
  },
  description: 'Get started quickly with Next.js, Postgres, and Stripe. A modern SaaS starter template with authentication, payments, and dashboard.',
  keywords: [
    'Next.js',
    'SaaS',
    'Starter',
    'Template',
    'React',
    'TypeScript',
    'Postgres',
    'Stripe',
    'Authentication',
    'Dashboard',
  ],
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
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
};