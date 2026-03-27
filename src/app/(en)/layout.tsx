import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { generateOrganizationJsonLd } from '@/lib/seo/jsonld';
import { ThemeProvider } from '@/components/ThemeProvider';
import { siteConfig } from '@/data/site';
import '../globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: 'ToolPiki - Free Online Tools',
    template: '%s | ToolPiki',
  },
  description: 'Free online tools for everyone. Text converters, image editors, color tools, calculators, and fun tests.',
  keywords: ['online tools', 'free tools', 'web utilities', 'free online utilities'],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  openGraph: {
    title: 'ToolPiki - Free Online Tools',
    description: 'Free online tools for everyone. Text converters, image editors, color tools, calculators, and fun tests.',
    siteName: 'ToolPiki',
    locale: 'en_US',
    type: 'website',
    url: `${siteConfig.url}/en`,
    images: [
      {
        url: `${siteConfig.url}/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'ToolPiki - Free Online Tools',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ToolPiki - Free Online Tools',
    description: 'Free online tools for everyone. Text converters, image editors, color tools, calculators, and fun tests.',
    images: [`${siteConfig.url}/og-image.png`],
  },
  alternates: {
    canonical: `${siteConfig.url}/en`,
    languages: {
      'ko': siteConfig.url,
      'en': `${siteConfig.url}/en`,
    },
  },
};

export default function EnRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Google Tag Manager */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-PGJ5JZ52');`,
          }}
        />
        {/* End Google Tag Manager */}
        <meta name="google-adsense-account" content="ca-pub-3612035754086019" />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3612035754086019"
          crossOrigin="anonymous"
        />
        {/* JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(generateOrganizationJsonLd()),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-PGJ5JZ52"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
