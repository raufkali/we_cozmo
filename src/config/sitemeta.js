// config/sitemeta.js (NOT sitemeta.jsx, NOT siteMeta.js)
const BRAND_NAME = process.env.NEXT_PUBLIC_BRAND_NAME || "WeCozmo";
const SITE_NAME =
  process.env.NEXT_PUBLIC_SITE_NAME || `${BRAND_NAME} - Premium Skincare`;
const SITE_DESCRIPTION =
  process.env.NEXT_PUBLIC_SITE_DESCRIPTION ||
  `Discover premium skincare and beauty products from ${BRAND_NAME}. Quality face creams, moisturizers, and beauty essentials for all skin types. Shop online in Pakistan.`;
const SITE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://wecozmo.com";

// Keywords for your website
const SITE_KEYWORDS = [
  BRAND_NAME,
  `${BRAND_NAME} skincare`,
  `${BRAND_NAME} products`,
  `${BRAND_NAME} Pakistan`,
  "premium skincare",
  "beauty products Pakistan",
  "face cream",
  "moisturizer",
  "skincare routine",
  "gold cream",
  "beauty cream",
  "skin brightening",
  "natural skincare",
  "organic beauty products",
  "skincare online Pakistan",
].join(", ");

export const siteMeta = {
  brandName: BRAND_NAME,
  siteName: SITE_NAME,
  siteDescription: SITE_DESCRIPTION,
  siteUrl: SITE_URL,
  siteKeywords: SITE_KEYWORDS,

  // Social Media (Uncomment when ready)
  // social: {
  //   facebook: process.env.NEXT_PUBLIC_FACEBOOK_URL || "https://facebook.com/wecozmo",
  //   instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL || "https://instagram.com/wecozmo",
  //   twitter: process.env.NEXT_PUBLIC_TWITTER_URL || "https://twitter.com/wecozmo",
  //   youtube: process.env.NEXT_PUBLIC_YOUTUBE_URL || "https://youtube.com/wecozmo",
  //   pinterest: process.env.NEXT_PUBLIC_PINTEREST_URL || "https://pinterest.com/wecozmo",
  //   linkedin: process.env.NEXT_PUBLIC_LINKEDIN_URL || "https://linkedin.com/company/wecozmo",
  // },

  // Contact
  contact: {
    email: process.env.NEXT_PUBLIC_EMAIL,
    phone: process.env.NEXT_PUBLIC_PHONE,
    address: "Pakistan",
    whatsapp: process.env.NEXT_PUBLIC_WHATSAPP,
  },

  // Default Images (Uncomment when ready)
  // images: {
  //   logo: "/images/logo.png",
  //   favicon: "/favicon.ico",
  //   ogImage: "/images/og-image.jpg",
  //   twitterImage: "/images/twitter-image.jpg",
  //   logoDark: "/images/logo-dark.png",
  //   logoLight: "/images/logo-light.png",
  // },

  // Business Info (Uncomment when ready)
  // business: {
  //   type: "OnlineStore",
  //   industry: "Skincare, Beauty",
  //   country: "Pakistan",
  //   city: "Lahore",
  //   currency: "PKR",
  // },
};
