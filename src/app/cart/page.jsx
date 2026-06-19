"use client";

import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/utils/helpers";
import Link from "next/link";

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart } =
    useCart();

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
    <>
      <h1 className="mb-4">Shopping Cart</h1>
      <div className="table-responsive">
        <table className="table table-hover">
          <thead>
            <tr>
              <th>Product</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Total</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {cartItems.map((item) => (
              <tr key={item.id}>
                <td>
                  <div className="d-flex align-items-center">
                    <img
                      src={item.image}
                      alt={item.name}
                      width="50"
                      height="50"
                      className="me-2"
                      style={{ objectFit: "cover" }}
                    />
                    {item.name}
                  </div>
                </td>
                <td>{formatPrice(item.price)}</td>
                <td>
                  <div className="input-group" style={{ width: "120px" }}>
                    <button
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      -
                    </button>
                    <input
                      type="text"
                      className="form-control form-control-sm text-center"
                      value={item.quantity}
                      readOnly
                    />
                    <button
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                </td>
                <td>{formatPrice(item.price * item.quantity)}</td>
                <td>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => removeFromCart(item.id)}
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="3" className="text-end fw-bold">
                Grand Total
              </td>
              <td className="fw-bold">{formatPrice(getCartTotal())}</td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>
      <div className="d-flex justify-content-between">
        <button className="btn btn-outline-danger" onClick={clearCart}>
          Clear Cart
        </button>
        <Link href="/checkout" className="btn btn-success">
          Proceed to Checkout
        </Link>
      </div>
    </>
  );
}
