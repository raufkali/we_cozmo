"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";

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

    try {
      const itemsList = cartItems
        .map(
          (item, index) =>
            `${index + 1}. ${item.name} x${item.quantity} - Rs. ${((item.price || 0) * (item.quantity || 1)).toFixed(2)}`,
        )
        .join("\n");

      // Use environment variables
      const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
      const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
      const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;
      const privateKey = process.env.NEXT_PUBLIC_EMAILJS_PRIVATE_KEY;
      const sellerEmail = process.env.NEXT_PUBLIC_EMAIL;

      console.log("📤 Sending order...");

      const response = await fetch(
        "https://api.emailjs.com/api/v1.0/email/send",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            service_id: serviceId,
            template_id: templateId,
            user_id: publicKey,
            accessToken: privateKey,
            template_params: {
              email: sellerEmail,
              subject: `New Order from ${formData.fullName} - Rs. ${cartTotal.toFixed(2)}`,
              customer_name: formData.fullName,
              customer_phone: formData.phone,
              customer_email: formData.email || "N/A",
              customer_city: formData.city,
              customer_address: formData.address,
              customer_notes: formData.notes || "None",
              order_items: itemsList,
              order_total: `Rs. ${cartTotal.toFixed(2)}`,
            },
          }),
        },
      );

      if (response.ok) {
        setSubmitted(true);
        setLoading(false);

        setTimeout(() => {
          if (typeof clearCart === "function") clearCart();
          if (typeof closeCart === "function") closeCart();
          if (typeof onClose === "function") onClose();
        }, 3000);
      } else {
        const errorText = await response.text();
        throw new Error(errorText);
      }
    } catch (err) {
      console.error("Error:", err);
      setError("Failed to send order. Please try again.");
      setLoading(false);
    }
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
        <div className="modal-content">
          <div
            className="modal-header"
            style={{ background: "var(--grad-primary)", color: "#fff" }}
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

          <div className="modal-body p-4">
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
                  Your order has been sent via Email.
                </p>
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
                        {((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                      </span>
                    </div>
                  ))}
                  <hr />
                  <div className="d-flex justify-content-between">
                    <strong>Total</strong>
                    <strong style={{ color: "var(--crimson)" }}>
                      Rs. {cartTotal.toFixed(2)}
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
