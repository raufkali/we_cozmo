"use client";

import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/utils/helpers";

export default function OrderSummary() {
  const { cartItems, getCartTotal } = useCart();

  if (cartItems.length === 0) {
    return <p className="text-muted">No items in cart.</p>;
  }

  return (
    <div className="card">
      <div className="card-header">
        <h5>Order Summary</h5>
      </div>
      <div className="card-body">
        <ul className="list-group list-group-flush">
          {cartItems.map((item) => (
            <li
              key={item.id}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <div>
                <span className="fw-bold">{item.name}</span>
                <span className="text-muted ms-2">x{item.quantity}</span>
              </div>
              <span>{formatPrice(item.price * item.quantity)}</span>
            </li>
          ))}
        </ul>
        <div className="d-flex justify-content-between fw-bold mt-3">
          <span>Total</span>
          <span>{formatPrice(getCartTotal())}</span>
        </div>
      </div>
    </div>
  );
}
