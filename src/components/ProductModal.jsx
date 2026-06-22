"use client";

import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { useState } from "react";

export default function ProductModal({ product, onClose }) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  const handleAddToCart = () => {
    addToCart(product, quantity);

    // Track add to cart with quantity
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
      style={{ background: "rgba(0,0,0,0.5)", zIndex: 1060 }}
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
                <p className="product-modal-description">
                  {product.description || "No description available."}
                </p>
                <p className="small text-muted">
                  {product.inStock !== false ? "In Stock" : "Out of Stock"}
                </p>
                {product.inStock !== false && (
                  <div className="d-flex gap-2 mt-3">
                    <div className="quantity-control">
                      <button
                        className="qty-btn"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      >
                        -
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
                      onClick={handleAddToCart}
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
