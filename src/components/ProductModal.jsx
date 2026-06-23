"use client";

import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";

export default function ProductModal({ product, onClose }) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isSticky, setIsSticky] = useState(false);
  const imageSectionRef = useRef(null);
  const buttonRef = useRef(null);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (product) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.width = "100%";

      return () => {
        document.body.style.overflow = originalOverflow;
        document.body.style.position = "";
        document.body.style.width = "";
      };
    }
  }, [product]);

  // Handle sticky button on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (imageSectionRef.current) {
        const rect = imageSectionRef.current.getBoundingClientRect();
        setIsSticky(rect.bottom <= 0);
      }
    };

    const modalBody = document.querySelector('.modal-body');
    if (modalBody) {
      modalBody.addEventListener('scroll', handleScroll);
      return () => modalBody.removeEventListener('scroll', handleScroll);
    }
  }, [product]);

  if (!product) return null;

  const handleAddToCart = () => {
    addToCart(product, quantity);

    fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event: "add_to_cart",
        productId: product.id,
        productName: product.name,
        price: product.price,
        quantity,
      }),
    }).catch(() => {});

    onClose();
  };

  return (
    <div
      className="modal d-block product-modal"
      tabIndex="-1"
      style={{
        background: "rgba(0,0,0,0.5)",
        zIndex: 1060,
        position: "fixed",
        inset: 0,
        overflow: "hidden",
      }}
      onClick={onClose}
    >
      <div
        className="modal-dialog modal-dialog-centered modal-lg"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxHeight: "90vh",
          margin: "1.75rem auto",
          pointerEvents: "none",
        }}
      >
        <div
          className="modal-content"
          style={{
            maxHeight: "90vh",
            pointerEvents: "auto",
          }}
        >
          <div className="modal-header" style={{ flexShrink: 0 }}>
            <h5 className="modal-title">{product.name}</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>
          <div
            className="modal-body"
            style={{ 
              overflowY: "auto", 
              flex: "1 1 auto",
              position: "relative",
            }}
          >
            <div className="row">
              <div className="col-md-6">
                {/* Image Section with ref */}
                <div ref={imageSectionRef}>
                  <div className="position-relative" style={{ height: "350px" }}>
                    <Image
                      src={product.image || "/images/placeholder.jpg"}
                      alt={product.name}
                      fill
                      className="product-modal-image"
                      style={{ objectFit: "contain" }}
                      sizes="(max-width: 768px) 100vw, 50vw"
                      priority
                    />
                  </div>
                </div>

                {/* Sticky Buttons - Desktop */}
                {product.inStock !== false && (
                  <div 
                    ref={buttonRef}
                    className={`sticky-buttons-desktop ${isSticky ? 'sticky-active' : ''}`}
                    style={{
                      position: isSticky ? 'sticky' : 'relative',
                      top: isSticky ? '0' : 'auto',
                      backgroundColor: isSticky ? 'white' : 'transparent',
                      padding: isSticky ? '1rem 0' : '0',
                      zIndex: isSticky ? 10 : 'auto',
                      boxShadow: isSticky ? '0 2px 10px rgba(0,0,0,0.1)' : 'none',
                      transition: 'all 0.3s ease',
                      marginTop: isSticky ? '0' : '1rem',
                      borderBottom: isSticky ? '1px solid #eee' : 'none',
                    }}
                  >
                    <div className="d-flex gap-2 align-items-center">
                      <div className="quantity-control" style={{ flexShrink: 0 }}>
                        <button
                          className="qty-btn"
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          aria-label="Decrease quantity"
                        >
                          -
                        </button>
                        <span className="qty-value">{quantity}</span>
                        <button
                          className="qty-btn"
                          onClick={() => setQuantity(quantity + 1)}
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                      <button
                        className="btn btn-primary flex-grow-1"
                        onClick={handleAddToCart}
                        style={{ whiteSpace: 'nowrap' }}
                      >
                        <i className="fas fa-shopping-bag me-1"></i> Add to Cart ({quantity})
                      </button>
                    </div>
                  </div>
                )}

                {/* Stock status under buttons */}
                <p className="small text-muted mt-2">
                  {product.inStock !== false ? "✅ In Stock" : "❌ Out of Stock"}
                </p>
              </div>

              <div className="col-md-6">
                <span className="badge bg-secondary mb-2">
                  {product.category}
                </span>
                <div className="product-modal-price">
                  Rs. {product.price?.toFixed(2)}
                </div>
                {product.originalPrice && (
                  <p className="text-muted text-decoration-line-through small">
                    Rs. {product.originalPrice.toFixed(2)}
                  </p>
                )}
                
                <div className="product-modal-description">
                  <ReactMarkdown
                    components={{
                      h1: ({node, ...props}) => (
                        <h1 style={{
                          fontSize: '1.5rem',
                          fontWeight: '700',
                          margin: '1rem 0 0.5rem',
                          color: '#000'
                        }} {...props} />
                      ),
                      h2: ({node, ...props}) => (
                        <h2 style={{
                          fontSize: '1.25rem',
                          fontWeight: '600',
                          margin: '0.75rem 0 0.5rem',
                          color: '#000'
                        }} {...props} />
                      ),
                      h3: ({node, ...props}) => (
                        <h3 style={{
                          fontSize: '1.1rem',
                          fontWeight: '600',
                          margin: '0.5rem 0 0.25rem',
                          color: '#000'
                        }} {...props} />
                      ),
                      p: ({node, ...props}) => (
                        <p style={{
                          marginBottom: '0.75rem',
                          lineHeight: '1.6'
                        }} {...props} />
                      ),
                      strong: ({node, ...props}) => (
                        <strong style={{
                          fontWeight: '700',
                          color: '#000'
                        }} {...props} />
                      ),
                      ul: ({node, ...props}) => (
                        <ul style={{
                          paddingLeft: '1.5rem',
                          marginBottom: '0.75rem',
                          listStyleType: 'disc'
                        }} {...props} />
                      ),
                      ol: ({node, ...props}) => (
                        <ol style={{
                          paddingLeft: '1.5rem',
                          marginBottom: '0.75rem',
                          listStyleType: 'decimal'
                        }} {...props} />
                      ),
                      li: ({node, ...props}) => (
                        <li style={{
                          marginBottom: '0.25rem',
                          lineHeight: '1.6'
                        }} {...props} />
                      ),
                    }}
                  >
                    {product.description || "No description available."}
                  </ReactMarkdown>
                </div>

                {/* Mobile Sticky Buttons */}
                {product.inStock !== false && (
                  <div className="sticky-buttons-mobile d-md-none">
                    <div className="d-flex gap-2 align-items-center">
                      <div className="quantity-control" style={{ flexShrink: 0 }}>
                        <button
                          className="qty-btn"
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          aria-label="Decrease quantity"
                        >
                          -
                        </button>
                        <span className="qty-value">{quantity}</span>
                        <button
                          className="qty-btn"
                          onClick={() => setQuantity(quantity + 1)}
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                      <button
                        className="btn btn-primary flex-grow-1"
                        onClick={handleAddToCart}
                        style={{ whiteSpace: 'nowrap' }}
                      >
                        <i className="fas fa-shopping-bag me-1"></i> Add to Cart ({quantity})
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}