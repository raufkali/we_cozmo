"use client";

import { useCart } from "@/context/CartContext";
import { useState } from "react";

export default function ProductModal({ product, onClose }) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  return (
    <div
      className="modal d-block product-modal"
      tabIndex="-1"
      style={{ background: "rgba(0,0,0,0.5)" }}
      onClick={onClose}
    >
      <div
        className="modal-dialog modal-dialog-centered modal-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{product.name}</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body">
            <div className="row">
              <div className="col-md-6">
                <img
                  src={product.image || "https://via.placeholder.com/400x400"}
                  alt={product.name}
                  className="product-modal-image"
                />
              </div>
              <div className="col-md-6">
                <span className="badge bg-secondary mb-2">
                  {product.category}
                </span>
                <div className="product-modal-price">
                  ${product.price?.toFixed(2)}
                </div>
                <p className="product-modal-description">
                  {product.description || "No description available."}
                </p>
                <p className="small text-muted">
                  {product.inStock ? "✅ In Stock" : "❌ Out of Stock"}
                </p>
                {product.inStock && (
                  <div className="d-flex gap-2 mt-3">
                    <div className="quantity-control">
                      <button
                        className="qty-btn"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      >
                        −
                      </button>
                      <span className="qty-value">{quantity}</span>
                      <button
                        className="qty-btn"
                        onClick={() => setQuantity(quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                    <button
                      className="btn btn-primary flex-grow-1"
                      onClick={() => {
                        addToCart(product, quantity);
                        onClose();
                      }}
                    >
                      <i className="fas fa-shopping-bag me-1"></i> Add to Cart (
                      {quantity})
                    </button>
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
