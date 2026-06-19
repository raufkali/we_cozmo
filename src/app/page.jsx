"use client";

import { useState, useEffect, useMemo } from "react";
import { products } from "@/data/products";
import { useCart } from "@/context/CartContext";
import ProductCard from "@/components/ProductCard";
import ProductModal from "@/components/ProductModal";

export default function HomePage() {
  const { addToCart } = useCart();

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const heroSlides = [
    {
      id: 1,
      image: "/images/banners/banner1.jpg",
      title: "Summer Glow",
      subtitle: "Up to 30% off on skincare essentials",
      cta: "Shop Now",
      category: "Skincare",
    },
    {
      id: 2,
      image: "/images/banners/banner2.jpg",
      title: "New Arrivals",
      subtitle: "Explore the latest makeup collection",
      cta: "Discover",
      category: "Makeup",
    },
    {
      id: 3,
      image: "/images/banners/banner3.jpg",
      title: "Luxury Fragrance",
      subtitle: "Limited time offers",
      cta: "Grab Deal",
      category: "Fragrance",
    },
  ];

  const TICKER_ITEMS = [
    "✦ Free delivery on orders above Rs. 2,000",
    "✦ 100% Original Products",
    "✦ Cruelty-Free Beauty",
    "✦ New Arrivals Every Week",
    "✦ Pakistan's Premier Cosmetics",
    "✦ Luxury Skincare from Rs. 599",
  ];

  const categories = [
    { name: "Makeup", image: "/images/categories/makeup.jpg" },
    { name: "Skincare", image: "/images/categories/skincare.jpg" },
    { name: "Fragrance", image: "/images/categories/fregrence.jpg" },
    { name: "Hair Care", image: "/images/categories/haircare.jpg" },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const allCategories = useMemo(
    () => ["All", ...new Set(products.map((p) => p.category))],
    [],
  );

  const filteredProducts = useMemo(() => {
    let list = products;
    if (selectedCategory && selectedCategory !== "All") {
      list = list.filter((p) => p.category === selectedCategory);
    }
    const q = searchQuery.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (p) =>
          p.name?.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q),
      );
    }
    return list;
  }, [selectedCategory, searchQuery]);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) element.scrollIntoView({ behavior: "smooth" });
  };

  const handleCategoryClick = (cat) => {
    setSelectedCategory(cat);
    scrollToSection("products");
  };

  const handleSlideCTA = (category) => {
    setSelectedCategory(category);
    scrollToSection("products");
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    const message = `New Contact:%0A%0AName: ${contactForm.name}%0AEmail: ${contactForm.email}%0AMessage: ${contactForm.message}`;
    window.open(
      `https://wa.me/${process.env.NEXT_PUBLIC_PHONE || "+923001234567"}?text=${message}`,
      "_blank",
    );
    setContactForm({ name: "", email: "", message: "" });
  };

  return (
    <>
      {/* Hero Carousel */}
      <div
        id="heroCarousel"
        className="carousel slide hero-carousel"
        data-bs-ride="carousel"
      >
        <div className="carousel-indicators">
          {heroSlides.map((_, idx) => (
            <button
              key={idx}
              type="button"
              data-bs-target="#heroCarousel"
              data-bs-slide-to={idx}
              className={idx === currentSlide ? "active" : ""}
              onClick={() => setCurrentSlide(idx)}
            />
          ))}
        </div>
        <div className="carousel-inner">
          {heroSlides.map((slide, idx) => (
            <div
              key={slide.id}
              className={`carousel-item${idx === currentSlide ? " active" : ""}`}
            >
              <img
                src={slide.image}
                className="d-block w-100"
                alt={slide.title}
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.parentElement.style.background =
                    "linear-gradient(135deg, #8b0000, #c0392b)";
                }}
              />
              <div className="carousel-caption">
                <h3>{slide.title}</h3>
                <p>{slide.subtitle}</p>
                <button
                  className="btn btn-primary"
                  onClick={() => handleSlideCTA(slide.category)}
                >
                  {slide.cta}
                </button>
              </div>
            </div>
          ))}
        </div>
        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#heroCarousel"
          data-bs-slide="prev"
          onClick={() =>
            setCurrentSlide(
              (p) => (p - 1 + heroSlides.length) % heroSlides.length,
            )
          }
        >
          <span className="carousel-control-prev-icon"></span>
        </button>
        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#heroCarousel"
          data-bs-slide="next"
          onClick={() => setCurrentSlide((p) => (p + 1) % heroSlides.length)}
        >
          <span className="carousel-control-next-icon"></span>
        </button>
      </div>

      {/* Ticker */}
      <div className="ticker-wrap">
        <div className="ticker-track">
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((text, i) => (
            <span key={i} className="ticker-item">
              {text}
              <span className="ticker-dot" />
            </span>
          ))}
        </div>
      </div>

      {/* Categories with Images */}
      <section id="categories" className="categories-section">
        <div className="container">
          <div className="section-header centered">
            <span className="section-label">Browse By</span>
            <h2 className="section-title">Categories</h2>
            <p className="section-subtitle">
              Find your perfect beauty essentials
            </p>
          </div>
          <div className="categories-grid">
            {categories.map((cat) => (
              <a
                key={cat.name}
                href="#products"
                className="category-card"
                onClick={(e) => {
                  e.preventDefault();
                  handleCategoryClick(cat.name);
                }}
              >
                <div className="category-image-wrapper">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/400x400/8b0000/ffffff?text=" +
                        cat.name;
                    }}
                  />
                  <div className="category-overlay">
                    <h3 className="category-name">{cat.name}</h3>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Products */}
      <section id="products" className="products-section">
        <div className="container">
          <div className="section-header centered">
            <span className="section-label">Our Collection</span>
            <h2 className="section-title">All Products</h2>
            <p className="section-subtitle">
              {filteredProducts.length} product
              {filteredProducts.length !== 1 ? "s" : ""} available
            </p>
          </div>

          <div className="filter-bar">
            <div className="search-wrap">
              <i className="fas fa-search search-icon"></i>
              <input
                type="text"
                className="form-control"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="filter-scroll">
              {allCategories.map((cat) => (
                <button
                  key={cat}
                  className={`filter-btn ${selectedCategory === cat ? "active" : ""}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="products-grid">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onQuickView={setSelectedProduct}
                />
              ))}
            </div>
          ) : (
            <div className="no-results">
              <i className="fas fa-search"></i>
              <h5>No products found</h5>
              <button
                className="btn btn-outline-primary mt-2"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("All");
                }}
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* About + Contact */}
      <section id="about-contact" className="about-contact-section">
        <div className="container">
          <div className="row g-4">
            <div className="col-lg-6">
              <div className="about-content">
                <span className="section-label">Our Story</span>
                <h2 className="section-title">
                  About {process.env.NEXT_PUBLIC_BRAND_NAME || "WeCozmo"}
                </h2>
                <div className="about-text mt-3">
                  <p className="lead-text">
                    Your trusted source for authentic makeup and skincare
                    products in Pakistan.
                  </p>
                  <p>
                    We believe everyone deserves access to premium beauty
                    products that enhance their natural beauty.
                  </p>
                </div>
                <div className="about-stats">
                  <div className="about-stat">
                    <span className="about-stat-number">5000+</span>
                    <span className="about-stat-label">Happy Customers</span>
                  </div>
                  <div className="about-stat">
                    <span className="about-stat-number">100%</span>
                    <span className="about-stat-label">Authentic</span>
                  </div>
                  <div className="about-stat">
                    <span className="about-stat-number">24/7</span>
                    <span className="about-stat-label">Support</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="contact-card">
                <span className="section-label">Get In Touch</span>
                <h2 className="section-title">Contact Us</h2>
                <div className="contact-info-items mt-3">
                  <div className="contact-info-item">
                    <div className="contact-info-icon">
                      <i className="fas fa-envelope"></i>
                    </div>
                    <div>
                      <span className="contact-info-label">Email</span>
                      <span className="contact-info-value">
                        <a
                          href={`mailto:${process.env.NEXT_PUBLIC_EMAIL || "seller@wecozmo.com"}`}
                        >
                          {process.env.NEXT_PUBLIC_EMAIL ||
                            "seller@wecozmo.com"}
                        </a>
                      </span>
                    </div>
                  </div>
                  <div className="contact-info-item">
                    <div className="contact-info-icon">
                      <i className="fas fa-phone"></i>
                    </div>
                    <div>
                      <span className="contact-info-label">Phone</span>
                      <span className="contact-info-value">
                        <a
                          href={`tel:${process.env.NEXT_PUBLIC_PHONE || "+923001234567"}`}
                        >
                          {process.env.NEXT_PUBLIC_PHONE || "+923001234567"}
                        </a>
                      </span>
                    </div>
                  </div>
                </div>
                <form
                  className="contact-form mt-3"
                  onSubmit={handleContactSubmit}
                >
                  <div className="mb-3">
                    <label className="form-label">Your Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      required
                      value={contactForm.name}
                      onChange={(e) =>
                        setContactForm({ ...contactForm, name: e.target.value })
                      }
                      placeholder="Enter your name"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Email Address *</label>
                    <input
                      type="email"
                      className="form-control"
                      required
                      value={contactForm.email}
                      onChange={(e) =>
                        setContactForm({
                          ...contactForm,
                          email: e.target.value,
                        })
                      }
                      placeholder="Enter your email"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Message *</label>
                    <textarea
                      className="form-control"
                      rows="4"
                      required
                      value={contactForm.message}
                      onChange={(e) =>
                        setContactForm({
                          ...contactForm,
                          message: e.target.value,
                        })
                      }
                      placeholder="How can we help you?"
                    ></textarea>
                  </div>
                  <button type="submit" className="btn btn-primary w-100">
                    <i className="fab fa-whatsapp me-2"></i>Send via WhatsApp
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Modal */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </>
  );
}
