import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Wayne — Build · Explore · Reshape Possibility',
  description: 'Wayne’s personal blog and digital portfolio across Android, iOS, AI, the Web, and open source.',
  metadataBase: new URL('https://waynez01.github.io'),
  openGraph: {
    title: 'Wayne — Build · Explore · Reshape Possibility',
    description: 'Android × iOS × AI × Web. Wayne’s personal blog and digital portfolio.',
    url: 'https://waynez01.github.io',
    siteName: 'Wayne / Digital Garden',
    locale: 'zh_CN',
    type: 'website',
    images: [{ url: '/og.jpg', width: 1200, height: 630, alt: 'WAYNE. 构建 · 探索 · 重塑可能' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Wayne — Build · Explore · Reshape Possibility',
    description: 'Android × iOS × AI × Web. Wayne’s personal blog and digital portfolio.',
    images: ['/og.jpg'],
  },
  icons: {
    icon: [{ url: '/favicon.png?v=20261030', type: 'image/png', sizes: '64x64' }],
    shortcut: '/favicon.png?v=20261030',
    apple: [{ url: '/apple-touch-icon.png?v=20261030', type: 'image/png', sizes: '180x180' }],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
