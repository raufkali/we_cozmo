// components/MetaTags.jsx
import Head from "next/head";
import { siteMeta } from "@/config/sitemeta"; // Make sure path matches

const {
  brandName,
  siteName,
  siteDescription,
  siteUrl,
  siteKeywords,
  // social, // Uncomment when ready
  contact,
  // images, // Uncomment when ready
  // business, // Uncomment when ready
} = siteMeta;

export default function MetaTags({
  // <-- ADDED default export
  title,
  description,
  keywords,
  image,
  url,
  type = "website",
  noIndex = false,
  children,
}) {
  // Use site defaults if not provided
  const pageTitle = title ? `${title} | ${brandName}` : siteName;
  const pageDescription = description || siteDescription;
  const pageKeywords = keywords || siteKeywords;
  const pageUrl = url || siteUrl;

  // Use image from props or default (uncomment when images are available)
  // const pageImage = image || images?.ogImage || "/images/og-image.jpg";
  const pageImage = image || "/images/og-image.jpg"; // Temporary fallback

  return (
    <Head>
      {/* ========== BASIC META TAGS ========== */}
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      <meta name="keywords" content={pageKeywords} />
      <meta
        name="robots"
        content={noIndex ? "noindex, nofollow" : "index, follow"}
      />

      {/* ========== BRAND META TAGS ========== */}
      <meta name="brand" content={brandName} />
      <meta name="application-name" content={brandName} />
      <meta name="author" content={brandName} />
      <meta name="generator" content={brandName} />
      <meta
        name="copyright"
        content={`© ${new Date().getFullYear()} ${brandName}`}
      />

      {/* ========== OPEN GRAPH / FACEBOOK ========== */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={pageUrl} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:image" content={pageImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content="en_US" />

      {/* ========== TWITTER ========== */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={pageUrl} />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
      <meta name="twitter:image" content={pageImage} />
      <meta name="twitter:site" content={`@${brandName.toLowerCase()}`} />
      <meta name="twitter:creator" content={`@${brandName.toLowerCase()}`} />

      {/* ========== CANONICAL URL ========== */}
      <link rel="canonical" href={pageUrl} />

      {/* ========== FAVICON ========== */}
      {/* Uncomment when favicon is ready */}
      {/* <link rel="icon" href={images?.favicon || "/favicon.ico"} sizes="any" /> */}
      {/* <link rel="apple-touch-icon" href={images?.logo || "/logo.png"} /> */}
      {/* <link rel="manifest" href="/site.webmanifest" /> */}

      {/* Temporary favicon */}
      <link rel="icon" href="/favicon.ico" sizes="any" />

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

      {/* ========== ROBOTS & SEARCH ENGINES ========== */}
      <meta name="googlebot" content="index, follow" />
      <meta name="bingbot" content="index, follow" />
      <meta name="slurp" content="index, follow" />
      <meta name="google" content="notranslate" />

      {/* ========== VERIFICATION TAGS ========== */}
      {/* Uncomment and add your verification codes */}
      {/* <meta name="google-site-verification" content="your-google-verification-code" /> */}
      {/* <meta name="msvalidate.01" content="your-bing-verification-code" /> */}
      {/* <meta name="yandex-verification" content="your-yandex-verification-code" /> */}
      {/* <meta name="p:domain_verify" content="your-pinterest-verification-code" /> */}

      {/* ========== SOCIAL MEDIA ========== */}
      {/* Uncomment when social links are ready */}
      {/* {social?.facebook && <meta property="article:author" content={social.facebook} />} */}
      {/* {social?.facebook && <meta property="article:publisher" content={social.facebook} />} */}
      {/* {social?.instagram && <meta name="instagram:site" content={social.instagram} />} */}

      {/* ========== DUBLIN CORE ========== */}
      <meta name="DC.title" content={pageTitle} />
      <meta name="DC.creator" content={brandName} />
      <meta name="DC.subject" content={pageKeywords} />
      <meta name="DC.description" content={pageDescription} />
      <meta name="DC.publisher" content={brandName} />
      <meta name="DC.language" content="en" />
      <meta name="DC.coverage" content="Pakistan" />
      <meta
        name="DC.rights"
        content={`© ${new Date().getFullYear()} ${brandName}`}
      />

      {/* ========== BUSINESS META TAGS ========== */}
      {/* Uncomment when business info is ready */}
      {/* <meta name="business:brand" content={brandName} /> */}
      {/* <meta name="business:industry" content={business?.industry || "Skincare, Beauty"} /> */}
      {/* <meta name="business:country" content={business?.country || "Pakistan"} /> */}
      {/* <meta name="business:type" content={business?.type || "OnlineStore"} /> */}

      {/* ========== CONTACT INFO ========== */}
      {/* Uncomment when contact info is ready */}
      {/* {contact?.email && <meta name="email" content={contact.email} />} */}
      {/* {contact?.phone && <meta name="phone" content={contact.phone} />} */}

      {/* ========== PRICE & CURRENCY ========== */}
      {/* Uncomment when business info is ready */}
      {/* <meta name="currency" content={business?.currency || "PKR"} /> */}

      {/* ========== ADDITIONAL META TAGS ========== */}
      <meta name="referrer" content="strict-origin-when-cross-origin" />

      {/* ========== CUSTOM CHILDREN ========== */}
      {children}
    </Head>
  );
}
