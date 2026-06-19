"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import CartSidebar from "./CartSidebar";

export default function Header() {
  const { getCartCount, openCart } = useCart();
  const cartCount = getCartCount();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const scrollTo = (sectionId) => {
    setMenuOpen(false);
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <nav className="wc-navbar navbar navbar-expand-lg">
        <div className="container">
          <a
            href="#"
            className="navbar-brand"
            onClick={(e) => {
              e.preventDefault();
              scrollTo("home");
            }}
          >
            WeCozmo
          </a>

          <div className="d-flex align-items-center gap-2 d-lg-none">
            <button className="cart-btn" onClick={openCart}>
              <i className="fas fa-shopping-bag"></i>
              {mounted && cartCount > 0 && (
                <span className="cart-badge">{cartCount}</span>
              )}
            </button>
            <button
              className="navbar-toggler"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <span className="navbar-toggler-icon"></span>
            </button>
          </div>

          <div className={`collapse navbar-collapse${menuOpen ? " show" : ""}`}>
            <ul className="navbar-nav ms-auto gap-lg-1">
              <li className="nav-item">
                <a
                  href="#home"
                  className="nav-link"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollTo("home");
                  }}
                >
                  Home
                </a>
              </li>
              <li className="nav-item">
                <a
                  href="#products"
                  className="nav-link"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollTo("products");
                  }}
                >
                  Products
                </a>
              </li>
              <li className="nav-item">
                <a
                  href="#about-contact"
                  className="nav-link"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollTo("about-contact");
                  }}
                >
                  About
                </a>
              </li>
              <li className="nav-item">
                <a
                  href="#about-contact"
                  className="nav-link"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollTo("about-contact");
                  }}
                >
                  Contact
                </a>
              </li>
              <li className="nav-item d-none d-lg-flex">
                <button className="cart-btn" onClick={openCart}>
                  <i className="fas fa-shopping-bag"></i>
                  {mounted && cartCount > 0 && (
                    <span className="cart-badge">{cartCount}</span>
                  )}
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      {mounted && <CartSidebar />}
    </>
  );
}
