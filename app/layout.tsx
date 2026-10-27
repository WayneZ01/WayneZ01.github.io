import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Wayne — Developer, Explorer & Builder',
  description: 'Wayne’s personal blog and digital portfolio across Android, iOS, AI, the Web, and open source.',
  metadataBase: new URL('https://www.dyw2.xyz'),
  alternates: { canonical: 'https://www.dyw2.xyz/' },
  openGraph: {
    title: 'Wayne — Developer, Explorer & Builder',
    description: 'Android × iOS × AI × Web. Wayne’s personal blog and digital portfolio.',
    url: 'https://www.dyw2.xyz',
    siteName: 'Wayne / Digital Garden',
    locale: 'en_US',
    type: 'website',
    images: [{ url: '/developer-worlds.webp', width: 800, height: 800, alt: 'Wayne — Android, iOS, Web and AI' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Wayne — Developer, Explorer & Builder',
    description: 'Android × iOS × AI × Web. Wayne’s personal blog and digital portfolio.',
    images: ['/developer-worlds.webp'],
  },
  icons: { icon: '/developer-favicon.png' },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
