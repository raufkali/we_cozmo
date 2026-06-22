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

  return (
    <div
      className="card product-card h-100"
      onClick={() => onQuickView?.(product)}
    >
      <div className="position-relative" style={{ height: "200px" }}>
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
        <p className="card-text text-muted small">
          Rs. {product.price?.toFixed(2)}
        </p>
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
