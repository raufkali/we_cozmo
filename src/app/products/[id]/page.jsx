"use client";

import { useParams } from "next/navigation";
import { products } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/utils/helpers";
import { useState } from "react";
import Link from "next/link";

export default function ProductDetailPage() {
  const { id } = useParams();
  const product = products.find((p) => p.id === parseInt(id));
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return <div className="alert alert-danger">Product not found.</div>;
  }

  const discountedPrice = product.discount
    ? product.price * (1 - product.discount / 100)
    : product.price;

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

  const handleAddToCart = () => {
    addToCart(product, quantity);
    alert("Added to cart!");
  };

  return (
    <div className="row g-4">
      <div className="col-md-6">
        <img
          src={product.image}
          alt={product.name}
          className="img-fluid rounded"
          style={{ maxHeight: "400px", objectFit: "contain" }}
        />
      </div>
      <div className="col-md-6">
        <h1>{product.name}</h1>
        <div className="mb-2">{renderStars(product.rating)}</div>
        <p className="lead">
          {product.discount ? (
            <>
              <span className="text-decoration-line-through me-2 text-muted">
                {formatPrice(product.price)}
              </span>
              <span className="text-danger fw-bold">
                {formatPrice(discountedPrice)}
              </span>
              <span className="badge bg-danger ms-2">-{product.discount}%</span>
            </>
          ) : (
            formatPrice(product.price)
          )}
        </p>
        <p className="text-muted">{product.description}</p>
        <p>
          <strong>Category:</strong> {product.category}
        </p>
        <p>
          <strong>Availability:</strong>{" "}
          {product.inStock ? (
            <span className="text-success">In Stock</span>
          ) : (
            <span className="text-danger">Out of Stock</span>
          )}
        </p>
        {product.inStock && (
          <div className="d-flex align-items-center gap-3">
            <div className="input-group" style={{ width: "120px" }}>
              <button
                className="btn btn-outline-secondary"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              >
                -
              </button>
              <input
                type="text"
                className="form-control text-center"
                value={quantity}
                readOnly
              />
              <button
                className="btn btn-outline-secondary"
                onClick={() => setQuantity((q) => q + 1)}
              >
                +
              </button>
            </div>
            <button
              className="btn btn-primary btn-lg"
              onClick={handleAddToCart}
            >
              Add to Cart
            </button>
          </div>
        )}
        <Link href="/products" className="btn btn-link mt-3">
          ← Back to Products
        </Link>
      </div>
    </div>
  );
}
