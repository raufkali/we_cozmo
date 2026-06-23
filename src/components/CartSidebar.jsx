"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import Image from "next/image";
import { useEffect } from "react";
import CheckoutModal from "./CheckoutModal";

export default function CartSidebar() {
  const {
    cartItems = [],
    removeFromCart = () => {},
    updateQuantity = () => {},
    getCartTotal = () => 0,
    getCartCount = () => 0,
    isOpen = false,
    closeCart = () => {},
  } = useCart();

  const cartCount = getCartCount();
  const cartTotal = getCartTotal();
  const [showCheckout, setShowCheckout] = useState(false);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") closeCart();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, closeCart]);

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleCheckoutClick = () => {
    setShowCheckout(true);
  };

  return (
    <>
      <div
        className={`cart-overlay ${isOpen ? "show" : ""}`}
        onClick={closeCart}
      />
      <div className={`cart-sidebar ${isOpen ? "show" : ""}`}>
        <div className="cart-sidebar-header">
          <h5 className="cart-sidebar-title">
            <i className="fas fa-shopping-bag me-2"></i>
            Your Cart
            {cartCount > 0 && (
              <span className="cart-count-badge ms-2">{cartCount}</span>
            )}
          </h5>
          <button className="cart-close-btn" onClick={closeCart}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="cart-sidebar-body">
          {cartItems.length === 0 ? (
            <div className="empty-cart">
              <div className="empty-cart-icon">
                <i className="fas fa-shopping-bag"></i>
              </div>
              <h6 className="empty-cart-title">Your cart is empty</h6>
              <p className="empty-cart-text">
                Add some products to get started!
              </p>
              <button
                className="btn btn-primary w-100 mt-3"
                onClick={closeCart}
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="cart-items-wrapper">
              <ul className="cart-items-list">
                {cartItems.map((item) => (
                  <li key={item.id} className="cart-item">
                    <div className="cart-item-layout">
                      <div className="cart-item-image position-relative">
                        <Image
                          src={item.image || "/images/placeholder.jpg"}
                          alt={item.name || "Product"}
                          fill
                          style={{ objectFit: "cover" }}
                          sizes="56px"
                        />
                      </div>

                      <div className="cart-item-details">
                        <span className="cart-item-name">
                          {item.name || "Product"}
                        </span>
                        <span className="cart-item-price">
                          PKR{" "}
                          {((item.price || 0) * (item.quantity || 1)).toFixed(
                            2,
                          )}{" "}
                          + Delivery Fee
                        </span>

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
                            >
                              −
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
                            >
                              +
                            </button>
                          </div>
                          <button
                            className="remove-btn"
                            onClick={() => removeFromCart(item.id)}
                          >
                            <i className="fas fa-trash-alt"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="cart-summary">
                <div className="cart-total-row">
                  <span>Subtotal</span>
                  <span>PKR {(cartTotal || 0).toFixed(2)} + Delivery FEE</span>
                </div>
                <div className="cart-shipping-note mb-2">
                  <i className="fas fa-truck"></i> Please note that this is not
                  the final fee. The total amount, including delivery charges,
                  will be calculated once we contact you.
                </div>
                <button
                  className="btn btn-primary w-100 checkout-btn"
                  onClick={handleCheckoutClick}
                >
                  <i className="fas fa-shopping-cart me-2"></i>
                  Proceed to Checkout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Checkout Modal */}
      {showCheckout && (
        <CheckoutModal
          onClose={() => setShowCheckout(false)}
          closeCart={closeCart}
        />
      )}
    </>
  );
}
