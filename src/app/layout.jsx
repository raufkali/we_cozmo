"use client";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "aos/dist/aos.css";
import "./globals.css";

import { useEffect } from "react";
import AOS from "aos";
import { CartProvider } from "@/context/CartContext";
import LayoutWrapper from "@/components/LayoutWrapper";
import SmoothScrollProvider from "@/components/SmoothScroll";
import { siteMeta } from "@/config/sitemeta";

export default function RootLayout({ children }) {
  useEffect(() => {
    if (typeof window !== "undefined") {
      AOS.init({
        duration: 800,
        easing: "ease-in-out",
        once: true,
        offset: 50,
      });
    }
  }, []);

  const { brandName, siteName, siteDescription, siteKeywords, siteUrl } =
    siteMeta;

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* ========== TITLE & BASIC META TAGS ========== */}
        <title>{siteName}</title>
        <meta name="description" content={siteDescription} />
        <meta name="keywords" content={siteKeywords} />
        <meta name="robots" content="index, follow" />

        {/* ========== BRAND META TAGS ========== */}
        <meta name="brand" content={brandName} />
        <meta name="application-name" content={brandName} />
        <meta name="author" content={brandName} />
        <meta name="generator" content={brandName} />

        {/* ========== OPEN GRAPH / FACEBOOK ========== */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={siteName} />
        <meta property="og:description" content={siteDescription} />
        <meta property="og:url" content={siteUrl} />
        <meta property="og:site_name" content={siteName} />
        <meta property="og:locale" content="en_US" />
        <meta property="og:image" content="/images/og-image.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />

        {/* ========== TWITTER ========== */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={siteName} />
        <meta name="twitter:description" content={siteDescription} />
        <meta name="twitter:image" content="/images/twitter-image.jpg" />
        <meta name="twitter:site" content={`@${brandName.toLowerCase()}`} />
        <meta name="twitter:creator" content={`@${brandName.toLowerCase()}`} />

        {/* ========== CANONICAL URL ========== */}
        <link rel="canonical" href={siteUrl} />

        {/* ========== VIEWPORT & RESPONSIVE ========== */}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=5"
        />
        <meta name="theme-color" content="#000000" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content={brandName} />

        {/* ========== GEO & LANGUAGE ========== */}
        <meta name="geo.region" content="PK" />
        <meta name="geo.country" content="Pakistan" />
        <meta name="language" content="English" />
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="format-detection" content="telephone=no" />

        {/* ========== ROBOTS ========== */}
        <meta name="googlebot" content="index, follow" />
        <meta name="bingbot" content="index, follow" />

        {/* ========== FAVICON ========== */}
        <link rel="icon" href="/favicon.ico" sizes="any" />

        {/* ========== FONT AWESOME CDN ========== */}
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
          integrity="sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </head>
      <body suppressHydrationWarning>
        <CartProvider>
          <LayoutWrapper>
            <SmoothScrollProvider>{children}</SmoothScrollProvider>
          </LayoutWrapper>
        </CartProvider>
      </body>
    </html>
  );
}
