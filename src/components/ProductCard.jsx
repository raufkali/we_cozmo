"use client";

import { useCart } from "@/context/CartContext";

export default function ProductCard({ product, onQuickView }) {
  const { addToCart } = useCart();

  return (
    <div
      className="card product-card h-100"
      onClick={() => onQuickView?.(product)}
    >
      <img
        src={
          product.image ||
          "https://via.placeholder.com/300x300/f5e8e8/8b0000?text=Product"
        }
        className="card-img-top"
        alt={product.name}
      />
      <div className="card-body">
        <h5 className="card-title">{product.name}</h5>
        <p className="card-text text-muted small">
          ${product.price?.toFixed(2)}
        </p>
        <button
          className="btn btn-primary btn-sm w-100"
          onClick={(e) => {
            e.stopPropagation();
            addToCart(product, 1);
          }}
        >
          <i className="fas fa-shopping-bag me-1"></i> Add to Cart
        </button>
      </div>
    </div>
  );
}
