export default function Footer() {
  const brandName = process.env.NEXT_PUBLIC_BRAND_NAME || "WeCozmo";

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
        <p className="footer-bottom text-center mb-0">
          &copy; {new Date().getFullYear()} {brandName}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
