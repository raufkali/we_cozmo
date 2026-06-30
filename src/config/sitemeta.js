// config/sitemeta.js
const BRAND_NAME = process.env.NEXT_PUBLIC_BRAND_NAME || "Reshine Cosmetics";
const SITE_NAME =
  process.env.NEXT_PUBLIC_SITE_NAME || `${BRAND_NAME} - Premium Beauty Store`;
const SITE_DESCRIPTION =
  process.env.NEXT_PUBLIC_BRAND_DESCRIPTION ||
  "Discover premium beauty, skincare, makeup, and cosmetic products at Reshine Cosmetics. Shop high-quality beauty essentials, skincare solutions, and makeup for every style with fast delivery and trusted quality.";
const SITE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || "https://reshinecosmetics.top";

// SEO-optimized keywords for cosmetics store
const SITE_KEYWORDS = [
  BRAND_NAME,
  `${BRAND_NAME} cosmetics`,
  `${BRAND_NAME} beauty products`,
  "premium cosmetics Pakistan",
  "skincare products online",
  "makeup products",
  "reshine cosmetics",
  "reshinecosmetics",
  "ReshineCosmetics",
  "Reshine Cosmetics Pakistan",
  "reshine products pakistan",
  "online reshine cosmetics",
  "reshine store online",
  "online store reshine",
  "cosmetics online",
  "Reshine cozmetics",
  "cozmetics reshine",
  "ReshineCozmitics",
  "beauty essentials",
  "cosmetics store",
  "skincare solutions",
  "beauty cream",
  "face makeup",
  "cosmetics online Pakistan",
  "beauty store",
  "makeup collection",
  "skincare routine products",
  "cosmetics brand",
  "affordable makeup",
  "luxury beauty products",
  "beauty shopping online",
].join(", ");

export const siteMeta = {
  brandName: BRAND_NAME,
  siteName: SITE_NAME,
  siteDescription: SITE_DESCRIPTION,
  siteUrl: SITE_URL,
  siteKeywords: SITE_KEYWORDS,

  // Social Media Links
  // social: {
  //   facebook:
  //     process.env.NEXT_PUBLIC_FACEBOOK_URL ||
  //     "https://facebook.com/reshinecosmetics",
  //   instagram:
  //     process.env.NEXT_PUBLIC_INSTAGRAM_URL ||
  //     "https://instagram.com/reshinecosmetics",
  //   twitter:
  //     process.env.NEXT_PUBLIC_TWITTER_URL ||
  //     "https://twitter.com/reshinecosmetics",
  //   tiktok:
  //     process.env.NEXT_PUBLIC_TIKTOK_URL ||
  //     "https://tiktok.com/@reshinecosmetics",
  // },

  // Contact Information
  contact: {
    email: process.env.NEXT_PUBLIC_EMAIL || "iqra.i.reshine@gmail.com",
    phone: process.env.NEXT_PUBLIC_PHONE || "+923436606652",
    address: "Pakistan",
    whatsapp: process.env.NEXT_PUBLIC_WHATSAPP || "+923436606652",
  },

  // Business Information
  business: {
    type: "OnlineStore",
    name: BRAND_NAME,
    industry: "Cosmetics, Skincare, Beauty",
    country: "Pakistan",
    currency: "PKR",
  },
};
