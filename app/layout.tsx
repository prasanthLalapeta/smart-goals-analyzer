import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

// Configure Inter font with subset preload
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'arial'],
  adjustFontFallback: true,
});

export const metadata: Metadata = {
  title: 'SMART Goals Analyzer',
  description: 'AI-powered tool to analyze and improve employee goals using SMART criteria',
  icons: {
    icon: '/favicon.png',
  },
  openGraph: {
    title: 'SMART Goals Analyzer',
    description: 'AI-powered tool to analyze and improve employee goals using SMART criteria',
    type: 'website',
    siteName: 'SMART Goals Analyzer',
    locale: 'en_US',
    images: [{
      url: '/share.png',
      width: 1200,
      height: 630,
      alt: 'SMART Goals Analyzer'
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SMART Goals Analyzer',
    description: 'AI-powered tool to analyze and improve employee goals using SMART criteria',
    images: ['/share.png'],
  },
  applicationName: 'SMART Goals Analyzer',
  keywords: ['SMART Goals', 'Goal Analysis', 'Employee Goals', 'AI Analysis', 'Performance Management'],
  authors: [{ name: 'SMART Goals Analyzer' }],
  creator: 'SMART Goals Analyzer',
  publisher: 'SMART Goals Analyzer',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.className}>
      <head>
        <link rel="icon" href="/favicon.png" type="image/png" />
      </head>
      <body>{children}</body>
    </html>
  );
}
