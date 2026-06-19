"use client";

import { useCart } from "@/context/CartContext";
import Link from "next/link";
import Image from "next/image";
import { useEffect } from "react";

export default function CartSidebar() {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    getCartTotal,
    getCartCount,
    isOpen,
    closeCart,
  } = useCart();

  const cartCount = getCartCount();
  const cartTotal = getCartTotal();

  // Close sidebar on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") closeCart();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [closeCart]);

  // Prevent body scroll when sidebar is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`cart-overlay ${isOpen ? "show" : ""}`}
        onClick={closeCart}
        aria-hidden="true"
      ></div>

      {/* Sidebar */}
      <div
        className={`cart-sidebar ${isOpen ? "show" : ""}`}
        aria-modal="true"
        role="dialog"
      >
        {/* Header */}
        <div className="cart-sidebar-header">
          <h5 className="cart-sidebar-title">
            <i className="fas fa-shopping-bag me-2"></i>
            Your Cart
            {cartCount > 0 && (
              <span className="cart-count-badge ms-2">{cartCount}</span>
            )}
          </h5>
          <button
            type="button"
            className="cart-close-btn"
            onClick={closeCart}
            aria-label="Close cart"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>

        {/* Body */}
        <div className="cart-sidebar-body">
          {!cartItems || cartItems.length === 0 ? (
            /* Empty Cart */
            <div className="empty-cart">
              <div className="empty-cart-icon">
                <i className="fas fa-shopping-bag"></i>
              </div>
              <h6 className="empty-cart-title">Your cart is empty</h6>
              <p className="empty-cart-text">
                Looks like you haven&apos;t added anything to your cart yet.
              </p>
              <Link
                href="/products"
                className="btn btn-primary w-100 mt-3"
                onClick={closeCart}
              >
                <i className="fas fa-th-large me-2"></i>
                Browse Products
              </Link>
            </div>
          ) : (
            /* Cart Items */
            <div className="cart-items-wrapper">
              {/* Cart Items List */}
              <ul className="cart-items-list">
                {cartItems.map((item) => (
                  <li key={item.id} className="cart-item">
                    <div className="cart-item-layout">
                      {/* Product Image */}
                      <div className="cart-item-image">
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={item.name || "Product"}
                            width={64}
                            height={64}
                            className="cart-item-img"
                          />
                        ) : (
                          <div className="cart-item-placeholder">
                            <i className="fas fa-image"></i>
                          </div>
                        )}
                      </div>

                      {/* Product Details */}
                      <div className="cart-item-details">
                        <Link
                          href={`/products/${item.id}`}
                          className="cart-item-name"
                          onClick={closeCart}
                        >
                          {item.name || "Product"}
                        </Link>

                        {item.variant && (
                          <span className="cart-item-variant">
                            {item.variant}
                          </span>
                        )}

                        <span className="cart-item-price">
                          $
                          {((item.price || 0) * (item.quantity || 1)).toFixed(
                            2,
                          )}
                        </span>
                      </div>

                      {/* Quantity Controls & Remove */}
                      <div className="cart-item-actions">
                        <div className="quantity-control">
                          <button
                            className="qty-btn"
                            onClick={() =>
                              handleQuantityChange(
                                item.id,
                                (item.quantity || 1) - 1,
                              )
                            }
                            aria-label="Decrease quantity"
                          >
                            <i className="fas fa-minus"></i>
                          </button>
                          <span className="qty-value">
                            {item.quantity || 1}
                          </span>
                          <button
                            className="qty-btn"
                            onClick={() =>
                              handleQuantityChange(
                                item.id,
                                (item.quantity || 1) + 1,
                              )
                            }
                            aria-label="Increase quantity"
                          >
                            <i className="fas fa-plus"></i>
                          </button>
                        </div>

                        <button
                          className="remove-btn"
                          onClick={() => removeFromCart(item.id)}
                          aria-label={`Remove ${item.name || "item"} from cart`}
                        >
                          <i className="fas fa-trash-alt"></i>
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              {/* Cart Summary */}
              <div className="cart-summary">
                <div className="cart-total-row">
                  <span>Subtotal</span>
                  <span>${(cartTotal || 0).toFixed(2)}</span>
                </div>

                <div className="cart-shipping-note">
                  <i className="fas fa-truck"></i>
                  Shipping calculated at checkout
                </div>

                <Link
                  href="/checkout"
                  className="btn btn-primary w-100 checkout-btn"
                  onClick={closeCart}
                >
                  <i className="fas fa-lock me-2"></i>
                  Proceed to Checkout
                </Link>

                <Link
                  href="/cart"
                  className="btn btn-outline-primary w-100 view-cart-btn"
                  onClick={closeCart}
                >
                  <i className="fas fa-shopping-cart me-2"></i>
                  View Full Cart
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
