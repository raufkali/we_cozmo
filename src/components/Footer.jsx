export default function Footer() {
  const brandName = process.env.NEXT_PUBLIC_BRAND_NAME || "WeCozmo";
  const email = process.env.NEXT_PUBLIC_EMAIL || "0";
  const phone = process.env.NEXT_PUBLIC_PHONE | "0";

  return (
    <footer className="wc-footer">
      <div className="container">
        <div className="row g-4">
          <div className="col-lg-4">
            <span className="footer-brand">{brandName}</span>
            <p className="text-white">
              Your trusted source for authentic makeup and skincare products in
              Pakistan.
            </p>
            <div className="footer-social mt-3">
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

          <div className="col-lg-2 col-md-4">
            <h6>Quick Links</h6>
            <a href="#home">Home</a>
            <br />
            <a href="#products">Products</a>
            <br />
            <a href="#categories">Categories</a>
            <br />
            <a href="#about-contact">About Us</a>
          </div>

          <div className="col-lg-2 col-md-4">
            <h6>Categories</h6>
            <a href="#products">Makeup</a>
            <br />
            <a href="#products">Skincare</a>
            <br />
            <a href="#products">Fragrance</a>
            <br />
            <a href="#products">Hair Care</a>
          </div>

          <div className="col-lg-4 col-md-4">
            <h6>Contact</h6>
            <p className="text-white">
              <i className="fas fa-envelope me-2"></i> {email}
            </p>
            {/* <p className="text-white">
              <i className="fas fa-phone me-2"></i> {phone}
            </p> */}
            <div className="footer-newsletter mt-3">
              <div className="input-group">
                <input
                  type="email"
                  className="form-control"
                  placeholder="Your email"
                />
                <button className="btn btn-primary">Subscribe</button>
              </div>
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
