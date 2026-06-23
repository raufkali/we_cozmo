"use client";

import Image from "next/image";
import { useCart } from "@/context/CartContext";

export default function ProductCard({ product, onQuickView }) {
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product, 1);

    // Track add to cart
    fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event: "add_to_cart",
        productId: product.id,
        productName: product.name,
        price: product.price,
        quantity: 1,
      }),
    }).catch(() => {});
  };

  // Check if product has discount (originalPrice exists and is greater than price)
  const hasDiscount =
    product.originalPrice && product.originalPrice > product.price;

  // Calculate discount percentage for badge
  const discountPercentage = hasDiscount
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100,
      )
    : 0;

  return (
    <div
      className="card product-card h-100"
      onClick={() => onQuickView?.(product)}
    >
      <div className="position-relative" style={{ height: "200px" }}>
        {hasDiscount && (
          <div
            className="position-absolute top-0 start-0 m-2 px-2 py-1 bg-danger text-white rounded-pill"
            style={{ fontSize: "0.7rem", fontWeight: "600", zIndex: 1 }}
          >
            -{discountPercentage}% OFF
          </div>
        )}
        <Image
          src={product.image || "/images/placeholder.jpg"}
          alt={product.name || "Product"}
          fill
          className="card-img-top"
          style={{ objectFit: "cover" }}
          sizes="(max-width: 576px) 50vw, (max-width: 992px) 33vw, 25vw"
          priority={false}
        />
      </div>
      <div className="card-body">
        <h5 className="card-title">{product.name}</h5>
        <div className="mb-2">
          {hasDiscount ? (
            <>
              <p className="card-text mb-0">
                <span
                  className="text-decoration-line-through text-muted me-2"
                  style={{ fontSize: "0.85rem" }}
                >
                  Rs. {product.originalPrice?.toFixed(2)}
                </span>
                <span
                  className="fw-bold text-danger"
                  style={{ fontSize: "1.05rem" }}
                >
                  Rs. {product.price?.toFixed(2)}
                </span>
              </p>
              <small className="text-success" style={{ fontSize: "0.7rem" }}>
                <i className="fas fa-tag me-1"></i>
                Save Rs. {(product.originalPrice - product.price)?.toFixed(2)}
              </small>
            </>
          ) : (
            <p className="card-text text-muted small">
              Rs. {product.price?.toFixed(2)}
            </p>
          )}
        </div>
        <button
          className="btn btn-primary btn-sm w-100"
          onClick={handleAddToCart}
        >
          <i className="fas fa-shopping-bag me-1"></i> Add to Cart
        </button>
      </div>
    </div>
  );
}
