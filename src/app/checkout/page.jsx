"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { generateOrderMessage } from "@/utils/helpers";
import OrderSummary from "@/components/OrderSummary";
import Link from "next/link";

export default function CheckoutPage() {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const [formData, setFormData] = useState({
    fullName: "",
    address: "",
    city: "",
    postalCode: "",
    phone: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    const orderData = {
      ...formData,
      items: cartItems,
      total: getCartTotal(),
    };

    const message = generateOrderMessage(orderData);

    // Send via WhatsApp
    const phone = process.env.NEXT_PUBLIC_PHONE || "+923001234567";
    const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");

    // Send via Email
    const email = process.env.NEXT_PUBLIC_EMAIL || "seller@wecozmo.com";
    const mailtoUrl = `mailto:${email}?subject=New Order&body=${encodeURIComponent(message)}`;
    window.open(mailtoUrl, "_blank");

    // Clear cart
    clearCart();

    // Show success message (optional)
    alert("Your order has been submitted. We will contact you shortly.");
  };

  if (cartItems.length === 0) {
    return (
      <div className="text-center py-5">
        <h3>Your cart is empty</h3>
        <Link href="/products" className="btn btn-primary mt-3">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="row g-4">
      <div className="col-md-7">
        <h2>Shipping Address</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Full Name *</label>
            <input
              type="text"
              className="form-control"
              name="fullName"
              required
              value={formData.fullName}
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Address *</label>
            <input
              type="text"
              className="form-control"
              name="address"
              required
              value={formData.address}
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">City *</label>
            <input
              type="text"
              className="form-control"
              name="city"
              required
              value={formData.city}
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Postal Code</label>
            <input
              type="text"
              className="form-control"
              name="postalCode"
              value={formData.postalCode}
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Phone (optional)</label>
            <input
              type="tel"
              className="form-control"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>
          <button type="submit" className="btn btn-success w-100">
            Place Order (WhatsApp & Email)
          </button>
        </form>
      </div>
      <div className="col-md-5">
        <OrderSummary />
      </div>
    </div>
  );
}
