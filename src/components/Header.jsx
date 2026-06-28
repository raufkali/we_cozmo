"use client";

import { useState, useEffect, useRef } from "react";
import { useCart } from "@/context/CartContext";
import CartSidebar from "./CartSidebar";

const themes = [
  {
    id: "crimson",
    name: "Crimson",
    icon: "fa-gem",
    color: "#8b0000",
    gradient: "linear-gradient(135deg, #8b0000, #c0392b)",
    description: "Luxury Red & Pearl",
  },
  {
    id: "gold",
    name: "Royal Gold",
    icon: "fa-crown",
    color: "#b8860b",
    gradient: "linear-gradient(135deg, #b8860b, #d4af37)",
    description: "Golden Elegance",
  },
  {
    id: "dark",
    name: "Obsidian",
    icon: "fa-moon",
    color: "#1a1a1a",
    gradient: "linear-gradient(135deg, #1a1a1a, #333333)",
    description: "Dark & Bold",
  },
  {
    id: "blue",
    name: "Sapphire",
    icon: "fa-gem",
    color: "#0a2463",
    gradient: "linear-gradient(135deg, #0a2463, #3b82f6)",
    description: "Cool Blue Pearl",
  },
];

export default function Header() {
  const { getCartCount, openCart } = useCart();
  const cartCount = getCartCount();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [themeOpen, setThemeOpen] = useState(false);
  const [activeTheme, setActiveTheme] = useState("crimson");
  const [animatingTheme, setAnimatingTheme] = useState(null);
  const themeDropdownRef = useRef(null);
  const themeButtonRef = useRef(null);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem("wecozmo-theme") || "crimson";
    setActiveTheme(savedTheme);
    applyTheme(savedTheme);
  }, []);

  // Close theme dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        themeDropdownRef.current &&
        !themeDropdownRef.current.contains(event.target) &&
        themeButtonRef.current &&
        !themeButtonRef.current.contains(event.target)
      ) {
        setThemeOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close theme dropdown on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (themeOpen) setThemeOpen(false);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [themeOpen]);

  const applyTheme = (theme) => {
    document.documentElement.setAttribute("data-theme", theme);
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      const colors = {
        crimson: "#8b0000",
        gold: "#b8860b",
        dark: "#1a1a1a",
        blue: "#0a2463",
      };
      metaThemeColor.setAttribute("content", colors[theme] || "#8b0000");
    }
  };

  const handleThemeChange = (themeId) => {
    if (themeId === activeTheme) {
      setThemeOpen(false);
      return;
    }

    setAnimatingTheme(themeId);
    setActiveTheme(themeId);
    applyTheme(themeId);
    localStorage.setItem("wecozmo-theme", themeId);
    setThemeOpen(false);

    // Reset animation state after transition
    setTimeout(() => setAnimatingTheme(null), 600);
  };

  const scrollTo = (sectionId) => {
    setMenuOpen(false);
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
  };

  const activeThemeData = themes.find((t) => t.id === activeTheme) || themes[0];

  return (
    <>
      <nav className="wc-navbar navbar navbar-expand-lg">
        <div className="container">
          {/* Brand */}
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

          {/* Mobile Actions */}
          <div className="d-flex align-items-center gap-2 d-lg-none">
            {/* Theme Toggle Mobile */}
            <button
              ref={themeButtonRef}
              className="theme-toggle-btn-mobile"
              onClick={() => setThemeOpen(!themeOpen)}
              aria-label="Change theme"
            >
              <i className={`fas ${activeThemeData.icon} theme-icon-pulse`}></i>
            </button>

            <button className="cart-btn" onClick={openCart}>
              <i className="fas fa-shopping-bag"></i>
              {mounted && cartCount > 0 && (
                <span className="cart-badge">{cartCount}</span>
              )}
            </button>

            <button
              className="navbar-toggler"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
          </div>

          {/* Nav Links */}
          <div className={`collapse navbar-collapse${menuOpen ? " show" : ""}`}>
            <ul className="navbar-nav ms-auto gap-lg-1 align-items-lg-center">
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

              {/* Desktop Theme Switcher */}
              <li className="nav-item d-none d-lg-block position-relative">
                <button
                  ref={themeButtonRef}
                  className="theme-toggle-btn-desktop"
                  onClick={() => setThemeOpen(!themeOpen)}
                  aria-label="Change theme"
                  aria-expanded={themeOpen}
                >
                  <span className="theme-btn-icon-wrapper">
                    <i
                      className={`fas ${activeThemeData.icon} theme-icon-pulse`}
                    ></i>
                  </span>
                  <span className="theme-btn-label">Theme</span>
                  <i
                    className={`fas fa-chevron-down theme-chevron ${
                      themeOpen ? "rotated" : ""
                    }`}
                  ></i>
                </button>

                {/* Theme Dropdown */}
                <div
                  ref={themeDropdownRef}
                  className={`theme-dropdown ${themeOpen ? "show" : ""}`}
                >
                  <div className="theme-dropdown-header">
                    <i className="fas fa-palette"></i>
                    <span>Choose Theme</span>
                  </div>
                  <div className="theme-dropdown-body">
                    {themes.map((theme) => (
                      <button
                        key={theme.id}
                        className={`theme-option ${
                          activeTheme === theme.id ? "active" : ""
                        } ${animatingTheme === theme.id ? "animating" : ""}`}
                        onClick={() => handleThemeChange(theme.id)}
                      >
                        <span
                          className="theme-swatch"
                          style={{ background: theme.gradient }}
                        >
                          {activeTheme === theme.id && (
                            <i className="fas fa-check theme-check"></i>
                          )}
                        </span>
                        <span className="theme-info">
                          <span className="theme-name">{theme.name}</span>
                          <span className="theme-desc">
                            {theme.description}
                          </span>
                        </span>
                        <i
                          className={`fas ${theme.icon} theme-option-icon`}
                          style={{ color: theme.color }}
                        ></i>
                      </button>
                    ))}
                  </div>
                </div>
              </li>

              {/* Desktop Cart */}
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

      {/* Mobile Theme Bottom Sheet */}
      {mounted && (
        <div
          className={`theme-mobile-overlay ${themeOpen ? "show" : ""}`}
          onClick={() => setThemeOpen(false)}
        />
      )}
      <div className={`theme-mobile-sheet ${themeOpen ? "show" : ""}`}>
        <div className="theme-mobile-handle" />
        <div className="theme-mobile-header">
          <h3>
            <i className="fas fa-palette"></i> Choose Theme
          </h3>
          <button
            className="theme-mobile-close"
            onClick={() => setThemeOpen(false)}
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
        <div className="theme-mobile-body">
          {themes.map((theme) => (
            <button
              key={theme.id}
              className={`theme-mobile-option ${
                activeTheme === theme.id ? "active" : ""
              }`}
              onClick={() => handleThemeChange(theme.id)}
            >
              <span
                className="theme-swatch-large"
                style={{ background: theme.gradient }}
              >
                {activeTheme === theme.id && (
                  <i className="fas fa-check-circle theme-check-large"></i>
                )}
              </span>
              <span className="theme-mobile-info">
                <span className="theme-mobile-name">{theme.name}</span>
                <span className="theme-mobile-desc">{theme.description}</span>
              </span>
            </button>
          ))}
        </div>
      </div>

      {mounted && <CartSidebar />}
    </>
  );
}
