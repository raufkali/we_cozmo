"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/utils/helpers";

export default function ProductCard({ product }) {
  // 🛡️ Guard: if product is undefined, render nothing
  if (!product) {
    return null;
  }

  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(product, 1);
  };

  const renderStars = (rating) => {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5;
    const empty = 5 - full - (half ? 1 : 0);
    return (
      <>
        {[...Array(full)].map((_, i) => (
          <i key={`full-${i}`} className="bi bi-star-fill text-warning"></i>
        ))}
        {half && <i className="bi bi-star-half text-warning"></i>}
        {[...Array(empty)].map((_, i) => (
          <i key={`empty-${i}`} className="bi bi-star text-warning"></i>
        ))}
      </>
    );
  };

  return (
    <div
      className="card h-100 shadow-sm product-card"
      data-aos="fade-up"
      data-aos-delay={product.id * 50}
    >
      <div className="position-relative overflow-hidden">
        <Link href={`/products/${product.id}`}>
          <img
            src={
              product.image ||
              "https://via.placeholder.com/300x300?text=No+Image"
            }
            alt={product.name}
            className="card-img-top"
            style={{ objectFit: "cover", height: "220px", cursor: "pointer" }}
          />
        </Link>
        {product.discount > 0 && (
          <span className="badge-sale badge rounded-pill">
            -{product.discount}%
          </span>
        )}
        {product.isNew && (
          <span className="badge-new badge rounded-pill">NEW</span>
        )}
      </div>
      <div className="card-body d-flex flex-column">
        <h5 className="card-title">
          <Link
            href={`/products/${product.id}`}
            className="text-decoration-none text-dark"
          >
            {product.name}
          </Link>
        </h5>
        <div className="mb-1 small">{renderStars(product.rating || 0)}</div>
        <p className="card-text text-muted">
          {product.discount > 0 ? (
            <>
              <span className="text-decoration-line-through me-2">
                {formatPrice(product.price)}
              </span>
              <span className="text-danger fw-bold">
                {formatPrice(product.price * (1 - product.discount / 100))}
              </span>
            </>
          ) : (
            formatPrice(product.price)
          )}
        </p>
        <button
          className="btn btn-primary mt-auto"
          onClick={handleAddToCart}
          disabled={!product.inStock}
        >
          {product.inStock ? "Add to Cart" : "Out of Stock"}
        </button>
      </div>
    </div>
  );
}
