"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { generateOrderMessage, cleanPhoneNumber } from "@/utils/helpers";

export default function CheckoutModal({ onClose, closeCart }) {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const cartTotal = getCartTotal();

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    notes: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [whatsappLink, setWhatsappLink] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!cartItems || cartItems.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    setLoading(true);
    setError("");

    const orderData = {
      customerInfo: {
        fullName: formData.fullName,
        phone: formData.phone,
        email: formData.email || "N/A",
        city: formData.city,
        address: formData.address,
        notes: formData.notes || "None",
      },
      cartItems: cartItems.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price || 0,
        quantity: item.quantity || 1,
      })),
      total: cartTotal,
    };

    // Construct WhatsApp message and URL
    const message = generateOrderMessage(orderData);
    const sellerPhone = cleanPhoneNumber(
      process.env.NEXT_PUBLIC_PHONE || "03492000050",
    );
    const whatsappUrl = `https://wa.me/${sellerPhone}?text=${encodeURIComponent(message)}`;
    setWhatsappLink(whatsappUrl);

    // Save order to Firebase via API
    try {
      fetch("/api/send-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
        keepalive: true,
      }).catch((err) => {
        console.error("Order save error:", err);
      });
    } catch (err) {
      console.error("Order save error:", err);
    }

    setSubmitted(true);
    setLoading(false);

    // Redirect to WhatsApp chat
    const win = window.open(whatsappUrl, "_blank");
    if (!win || win.closed || typeof win.closed === "undefined") {
      window.location.href = whatsappUrl;
    }

    setTimeout(() => {
      if (typeof clearCart === "function") clearCart();
      if (typeof closeCart === "function") closeCart();
      if (typeof onClose === "function") onClose();
    }, 5000);
  };

  return (
    <div
      className="modal d-block checkout-modal"
      tabIndex="-1"
      style={{ background: "rgba(0,0,0,0.6)", zIndex: 1070 }}
      onClick={onClose}
    >
      <div
        className="modal-dialog modal-dialog-centered modal-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="modal-content"
          style={{
            maxHeight: "90vh",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            className="modal-header"
            style={{
              background: "var(--grad-primary)",
              color: "#fff",
              flexShrink: 0,
            }}
          >
            <h5
              className="modal-title"
              style={{ color: "#fff", fontFamily: "var(--font-display)" }}
            >
              <i className="fas fa-shopping-cart me-2"></i>
              {submitted ? "Order Confirmed!" : "Checkout"}
            </h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={onClose}
            ></button>
          </div>

          <div
            className="modal-body p-4"
            style={{ overflowY: "auto", flex: 1 }}
          >
            {submitted ? (
              <div className="text-center py-5">
                <div className="mb-3">
                  <i
                    className="fas fa-check-circle"
                    style={{ fontSize: "5rem", color: "#25d366" }}
                  ></i>
                </div>
                <h4
                  style={{
                    fontFamily: "var(--font-display)",
                    color: "var(--crimson)",
                  }}
                >
                  Order Submitted Successfully!
                </h4>
                <p className="text-muted">
                  Your order has been placed. Redirecting to WhatsApp to send product details...
                </p>
                {whatsappLink && (
                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-success mt-2 px-4 py-2"
                    style={{
                      backgroundColor: "#25d366",
                      borderColor: "#25d366",
                    }}
                  >
                    <i className="fab fa-whatsapp me-2"></i>
                    Send Order via WhatsApp
                  </a>
                )}
              </div>
            ) : (
              <>
                {error && <div className="alert alert-danger">{error}</div>}

                <div className="order-summary-box mb-4">
                  <h6 className="mb-3">Order Summary</h6>
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="d-flex justify-content-between mb-2"
                    >
                      <span className="small">
                        {item.name} x{item.quantity}
                      </span>
                      <span>
                        Rs.{" "}
                        {((item.price || 0) * (item.quantity || 1)).toFixed(
                          2,
                        )}{" "}
                      </span>
                    </div>
                  ))}
                  <hr />
                  <div className="d-flex justify-content-between">
                    <strong>Total</strong>
                    <strong style={{ color: "var(--crimson)" }}>
                      Rs. {cartTotal.toFixed(2)} + Delivery Fee
                    </strong>
                  </div>
                </div>

                <form onSubmit={handleSubmit}>
                  <h6 className="mb-3">Delivery Details</h6>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Full Name *</label>
                      <input
                        type="text"
                        className="form-control"
                        name="fullName"
                        required
                        value={formData.fullName}
                        onChange={handleChange}
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Phone *</label>
                      <input
                        type="tel"
                        className="form-control"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="03XX-XXXXXXX"
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Email</label>
                      <input
                        type="email"
                        className="form-control"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="your@email.com"
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">City *</label>
                      <input
                        type="text"
                        className="form-control"
                        name="city"
                        required
                        value={formData.city}
                        onChange={handleChange}
                        placeholder="Your city"
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label">Address *</label>
                      <textarea
                        className="form-control"
                        name="address"
                        rows="2"
                        required
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="House No., Street, Area"
                      ></textarea>
                    </div>
                    <div className="col-12">
                      <label className="form-label">Notes</label>
                      <textarea
                        className="form-control"
                        name="notes"
                        rows="2"
                        value={formData.notes}
                        onChange={handleChange}
                        placeholder="Any special instructions..."
                      ></textarea>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary w-100 mt-4 py-3"
                    disabled={loading}
                  >
                    {loading ? "Sending..." : "Place Order"}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
