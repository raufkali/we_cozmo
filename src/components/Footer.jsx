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
        {/* Top Section - Brand + Social */}
        <div className="row g-4 align-items-center">
          <div className="col-lg-6">
            <div className="footer-brand-wrapper">
              <span className="footer-brand">{brandName}</span>
              <p className="footer-description">
                Your trusted source for authentic makeup and skincare products
                in Pakistan.
              </p>
            </div>
          </div>
          <div className="col-lg-6 text-lg-end">
            <div className="footer-social-wrapper">
              <span className="footer-social-label">Follow Us</span>
              <div className="footer-social">
                <a href="#" aria-label="Instagram" className="social-link">
                  <i className="fab fa-instagram"></i>
                </a>
                <a href="#" aria-label="Facebook" className="social-link">
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a href="#" aria-label="WhatsApp" className="social-link">
                  <i className="fab fa-whatsapp"></i>
                </a>
              </div>
            </div>
          </div>
        </div>

        <hr className="footer-divider" />

        {/* Bottom Section - Copyright */}
        <div className="footer-copyright-wrapper">
          <p className="footer-copyright-text text-light">
            &copy; {new Date().getFullYear()} {brandName}. All rights reserved.
          </p>
          <div className="footer-bottom-links">
            <a href="#" className="footer-bottom-link text-light">
              Privacy Policy
            </a>
            <span className="footer-bottom-divider">•</span>
            <a href="#" className="footer-bottom-link text-light">
              Terms of Service
            </a>
          </div>
        </div>
        <hr className="footer-divider" />

        {/* Middle Section - Credit + Sign In */}
        <div className="row align-items-center g-3">
          {/* <div className="col-md-8">
            <div className="footer-credit-wrapper">
              <span className="footer-credit-icon">
                <i className="fas fa-code"></i>
              </span>
              <span className="footer-credit-text">
                Developed & Maintained by
              </span>
              <span className="footer-credit-name">Rauf Ahmad</span>
              <span className="footer-credit-divider">|</span>
              <a
                href="mailto:ahmadraufbd@gmail.com"
                className="footer-credit-email"
              >
                <i className="fas fa-envelope"></i>
                ahmadraufbd@gmail.com
              </a>
            </div>
          </div> */}
          <div className="col-md-12 text-center text-md-center">
            <button onClick={handleSignIn} className="footer-signin-btn">
              <i
                className="fas fa-lock"
                style={{ fontSize: "0.6rem", marginRight: "4px" }}
              ></i>
              Sign In
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .footer-brand-wrapper {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .footer-brand {
          font-family: var(--font-display);
          font-size: 1.8rem;
          font-weight: 700;
          background: linear-gradient(135deg, #ffffff, var(--primary-soft));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          letter-spacing: -0.5px;
          display: inline-block;
        }

        .footer-description {
          color: var(--footer-text);
          font-size: 0.85rem;
          font-weight: 300;
          opacity: 0.8;
          margin: 0;
          line-height: 1.6;
          max-width: 400px;
        }

        .footer-social-wrapper {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 12px;
        }

        .footer-social-label {
          color: var(--footer-text);
          font-size: 0.7rem;
          font-weight: 400;
          letter-spacing: 1px;
          text-transform: uppercase;
          opacity: 0.5;
          margin-right: 4px;
        }

        .footer-social {
          display: flex;
          gap: 8px;
        }

        .social-link {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 38px;
          height: 38px;
          border-radius: 50%;
          border: 1px solid var(--footer-social-border);
          color: var(--footer-link) !important;
          font-size: 0.9rem;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          background: rgba(255, 255, 255, 0.03);
          text-decoration: none;
        }

        .social-link:hover {
          background: var(--grad-primary);
          border-color: transparent;
          color: #fff !important;
          transform: translateY(-3px) scale(1.05);
          box-shadow: 0 8px 25px rgba(139, 0, 0, 0.25);
        }

        .footer-divider {
          border-color: var(--footer-divider) !important;
          margin: 1.2rem 0;
          opacity: 0.6;
        }

        /* Credit Section */
        .footer-credit-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          flex-wrap: wrap;
          padding: 4px 0;
        }

        .footer-credit-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: var(--primary-light);
          font-size: 0.75rem;
          opacity: 0.8;
          animation: codePulse 2s ease-in-out infinite;
        }

        @keyframes codePulse {
          0%,
          100% {
            opacity: 0.8;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.1);
          }
        }

        .footer-credit-text {
          color: var(--footer-text);
          font-size: 0.8rem;
          font-weight: 300;
          opacity: 0.7;
        }

        .footer-credit-name {
          color: var(--primary-light);
          font-size: 0.85rem;
          font-weight: 600;
          background: linear-gradient(
            135deg,
            var(--primary-light),
            var(--accent-light)
          );
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          transition: all 0.3s ease;
          cursor: default;
        }

        .footer-credit-name:hover {
          transform: scale(1.05);
          filter: brightness(1.2);
        }

        .footer-credit-divider {
          color: var(--footer-text);
          opacity: 0.2;
          font-size: 0.6rem;
        }

        .footer-credit-email {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          color: var(--footer-link);
          text-decoration: none;
          font-size: 0.8rem;
          font-weight: 300;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          padding: 4px 8px;
          border-radius: 6px;
        }

        .footer-credit-email i {
          color: var(--primary-light);
          font-size: 0.7rem;
          opacity: 0.7;
          transition: all 0.3s ease;
        }

        .footer-credit-email:hover {
          color: var(--primary-light);
          transform: translateX(3px);
          background: rgba(255, 255, 255, 0.05);
        }

        .footer-credit-email:hover i {
          opacity: 1;
          transform: rotate(-5deg);
        }

        /* Sign In Button */
        .footer-signin-btn {
          display: inline-flex;
          align-items: center;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.15);
          color: rgba(255, 255, 255, 0.6);
          padding: 6px 20px;
          border-radius: 50px;
          font-size: 0.75rem;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          font-family: inherit;
          letter-spacing: 0.5px;
          font-weight: 400;
          backdrop-filter: blur(4px);
        }

        .footer-signin-btn:hover {
          border-color: var(--primary-light);
          color: #fff;
          background: rgba(255, 255, 255, 0.1);
          transform: translateY(-2px);
          box-shadow: 0 4px 20px rgba(139, 0, 0, 0.2);
        }

        .footer-signin-btn:active {
          transform: scale(0.95);
        }

        /* Bottom Copyright Section */
        .footer-copyright-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          padding-top: 4px;
        }

        @media (min-width: 768px) {
          .footer-copyright-wrapper {
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
          }
        }

        .footer-copyright-text {
          color: var(--footer-bottom);
          font-size: 0.75rem;
          margin: 0;
          opacity: 0.6;
          letter-spacing: 0.3px;
        }

        .footer-bottom-links {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .footer-bottom-link {
          color: var(--footer-bottom);
          font-size: 0.7rem;
          text-decoration: none;
          opacity: 0.4;
          transition: all 0.3s ease;
          letter-spacing: 0.3px;
        }

        .footer-bottom-link:hover {
          color: var(--primary-light);
          opacity: 1;
          transform: translateY(-1px);
        }

        .footer-bottom-divider {
          color: var(--footer-bottom);
          font-size: 0.5rem;
          opacity: 0.2;
        }

        /* Responsive Adjustments */
        @media (max-width: 991px) {
          .footer-social-wrapper {
            justify-content: center;
            margin-top: 8px;
          }

          .footer-description {
            max-width: 100%;
            text-align: center;
          }

          .footer-brand-wrapper {
            align-items: center;
            text-align: center;
          }
        }

        @media (max-width: 767px) {
          .footer-credit-wrapper {
            flex-direction: column;
            gap: 6px;
            text-align: center;
          }

          .footer-credit-divider {
            display: none;
          }

          .footer-credit-email {
            font-size: 0.75rem;
          }

          .footer-signin-btn {
            width: 100%;
            justify-content: center;
          }

          .footer-bottom-links {
            justify-content: center;
          }

          .footer-copyright-wrapper {
            gap: 12px;
          }

          .footer-brand {
            font-size: 1.5rem;
          }

          .footer-social-label {
            display: none;
          }
        }

        @media (max-width: 400px) {
          .footer-credit-wrapper {
            font-size: 0.7rem;
          }

          .footer-credit-name {
            font-size: 0.75rem;
          }
        }

        /* Subtle glow animation for the brand */
        @keyframes brandGlow {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.85;
          }
        }

        .footer-brand {
          animation: brandGlow 3s ease-in-out infinite;
        }
      `}</style>
    </footer>
  );
}
