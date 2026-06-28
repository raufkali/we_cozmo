"use client";

import { useRouter } from "next/navigation";

export default function Footer() {
  const brandName = process.env.NEXT_PUBLIC_BRAND_NAME || "WeCozmo";
  const router = useRouter();

  const handleSignIn = () => {
    router.push("/secret");
  };

  return (
    <footer className="wc-footer">
      <div className="container">
        <div className="row g-4">
          <div className="col-lg-6">
            <span className="footer-brand">{brandName}</span>
            <p className="text-white">
              Your trusted source for authentic makeup and skincare products in
              Pakistan.
            </p>
          </div>
          <div className="col-lg-6 text-lg-end">
            <div className="footer-social">
              <a href="#" aria-label="Instagram">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" aria-label="Facebook">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" aria-label="WhatsApp">
                <i className="fab fa-whatsapp"></i>
              </a>
            </div>
          </div>
        </div>

        <hr className="footer-divider" />

        <div className="row align-items-center">
          <div className="col-md-8">
            <p className="footer-bottom text-center text-md-start mb-0">
              DEVELOPED & MAINTAINED BY RUFI BOY, CONTACT
              "ahmadraufbd@gmaill.com"
            </p>
          </div>
          <div className="col-md-4 text-center text-md-end">
            {/* Regular Sign In button - redirects to /secret */}
            <button
              onClick={handleSignIn}
              style={{
                background: "transparent",
                border: "1px solid rgba(255,255,255,0.2)",
                color: "rgba(255,255,255,0.5)",
                padding: "4px 16px",
                borderRadius: "20px",
                fontSize: "0.7rem",
                cursor: "pointer",
                transition: "all 0.3s ease",
                fontFamily: "inherit",
                letterSpacing: "0.5px",
              }}
              onMouseEnter={(e) => {
                e.target.style.borderColor = "rgba(255,255,255,0.4)";
                e.target.style.color = "rgba(255,255,255,0.8)";
              }}
              onMouseLeave={(e) => {
                e.target.style.borderColor = "rgba(255,255,255,0.2)";
                e.target.style.color = "rgba(255,255,255,0.5)";
              }}
            >
              Sign In
            </button>
          </div>
        </div>

        <hr className="footer-divider" />

        <p className="footer-bottom text-center mb-0">
          &copy; {new Date().getFullYear()} {brandName}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
