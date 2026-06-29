// app/layout.js - Server Component (NO "use client")
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "aos/dist/aos.css";
import "./globals.css";

import { siteMeta } from "@/config/sitemeta";
import ClientLayout from "@/components/ClientLayout";

// ✅ Metadata export (without viewport/themeColor)
export const metadata = {
  title: `${siteMeta.siteName} | Premium Cosmetics, Skincare & Beauty Products`,
  description: siteMeta.siteDescription,
  keywords: siteMeta.siteKeywords,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  metadataBase: new URL(siteMeta.siteUrl),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: siteMeta.siteName,
    description: siteMeta.siteDescription,
    url: siteMeta.siteUrl,
    siteName: siteMeta.siteName,
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: siteMeta.siteName,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteMeta.siteName,
    description: siteMeta.siteDescription,
    images: ["/images/twitter-image.jpg"],
    site: `@${siteMeta.brandName.toLowerCase()}`,
    creator: `@${siteMeta.brandName.toLowerCase()}`,
  },
  applicationName: siteMeta.brandName,
  authors: [{ name: siteMeta.brandName }],
  generator: siteMeta.brandName,
  formatDetection: {
    telephone: false,
  },
  other: {
    "geo.region": "PK",
    "geo.country": "Pakistan",
    language: "English",
  },
};

// ✅ Viewport export (separate from metadata)
export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#000000",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

        {/* Apple Web App */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content={siteMeta.brandName} />

        {/* Preconnect to external resources */}
        <link rel="preconnect" href="https://cdnjs.cloudflare.com" />
        <link rel="dns-prefetch" href="https://cdnjs.cloudflare.com" />

        {/* Font Awesome CDN */}
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
          integrity="sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </head>
      <body suppressHydrationWarning>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
