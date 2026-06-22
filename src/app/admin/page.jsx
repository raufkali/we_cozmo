"use client";
import { useState, useEffect, useCallback } from "react";
import { auth, db } from "@/lib/firebase";
import { doc, updateDoc } from "firebase/firestore";
import "./AdminPanel.css";
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

// ── Toast Component ──────────────────────────
function Toast({ message, type, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColors = {
    success: "linear-gradient(135deg, #00875a, #00c48c)",
    error: "linear-gradient(135deg, #c0392b, #e74c3c)",
    info: "linear-gradient(135deg, #8b0000, #c0392b)",
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 20,
        right: 20,
        zIndex: 9999,
        background: bgColors[type] || bgColors.info,
        color: "#fff",
        padding: "12px 20px",
        borderRadius: "var(--radius-md)",
        boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
        fontFamily: "var(--font-body)",
        fontSize: "0.82rem",
        fontWeight: 500,
        letterSpacing: "0.02em",
        maxWidth: 380,
        animation: "toastSlideIn 0.3s ease",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(255,255,255,0.15)",
      }}
    >
      {message}
    </div>
  );
}

export default function AdminPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("analytics");
  const [pageLoading, setPageLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [banners, setBanners] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [orderFilter, setOrderFilter] = useState("all");
  const [showProductModal, setShowProductModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showBannerModal, setShowBannerModal] = useState(false);

  const [editingProduct, setEditingProduct] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingBanner, setEditingBanner] = useState(null);

  const [productForm, setProductForm] = useState({
    name: "",
    price: "",
    originalPrice: "",
    category: "",
    description: "",
    stock: "",
  });
  const [categoryForm, setCategoryForm] = useState({ name: "", image: "" });
  const [bannerForm, setBannerForm] = useState({
    title: "",
    subtitle: "",
    cta: "",
    image: "",
    order: 0,
    active: true,
  });
  const [productImage, setProductImage] = useState(null);
  const [categoryImage, setCategoryImage] = useState(null);
  const [bannerImage, setBannerImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type, id: Date.now() });
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) loadAllData();
  }, [user]);

  const loadAllData = async () => {
    setPageLoading(true);
    await Promise.all([
      loadProducts(),
      loadCategories(),
      loadBanners(),
      loadAnalytics(),
    ]);
    setPageLoading(false);
  };

  const loadProducts = async () => {
    const res = await fetch("/api/products");
    const data = await res.json();
    setProducts(Array.isArray(data) ? data : []);
  };
  const loadCategories = async () => {
    const res = await fetch("/api/categories");
    const data = await res.json();
    setCategories(Array.isArray(data) ? data : []);
  };
  const loadBanners = async () => {
    const res = await fetch("/api/banners");
    const data = await res.json();
    setBanners(Array.isArray(data) ? data : []);
  };
  const loadAnalytics = async () => {
    const res = await fetch("/api/analytics");
    const data = await res.json();
    setAnalytics(data);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setPageLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      showToast("Welcome back, administrator", "info");
    } catch (err) {
      setError("Invalid credentials. Access denied.");
      showToast("Login failed. Please check your credentials.", "error");
    } finally {
      setPageLoading(false);
    }
  };
  const handleLogout = () => {
    signOut(auth);
    showToast("Logged out successfully", "info");
  };

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: formData });
    const data = await res.json();
    return data.url;
  };

  // ── PRODUCTS ─────────────────────────────
  const handleAddProduct = async (e) => {
    e.preventDefault();
    setUploading(true);
    let imageUrl = editingProduct?.image || "";
    if (productImage) imageUrl = await uploadImage(productImage);
    setUploading(false);
    if (!imageUrl) {
      showToast("Image upload failed. Please try again.", "error");
      return;
    }

    setPageLoading(true);
    const url = "/api/products";
    const method = editingProduct ? "PUT" : "POST";
    const body = editingProduct
      ? {
          id: editingProduct.id,
          ...productForm,
          price: parseFloat(productForm.price),
          originalPrice: productForm.originalPrice
            ? parseFloat(productForm.originalPrice)
            : null,
          stock: parseInt(productForm.stock),
          image: imageUrl,
        }
      : {
          ...productForm,
          price: parseFloat(productForm.price),
          originalPrice: productForm.originalPrice
            ? parseFloat(productForm.originalPrice)
            : null,
          stock: parseInt(productForm.stock),
          image: imageUrl,
        };

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    setPageLoading(false);

    if (res.ok) {
      showToast(
        editingProduct
          ? "Product updated successfully"
          : "Product added successfully",
        "success",
      );
    } else {
      showToast("Failed to save product", "error");
    }

    setProductForm({
      name: "",
      price: "",
      originalPrice: "",
      category: "",
      description: "",
      stock: "",
    });
    setProductImage(null);
    setEditingProduct(null);
    setShowProductModal(false);
    loadProducts();
  };

  const handleDeleteProduct = async (id) => {
    if (!confirm("Delete this product?")) return;
    setPageLoading(true);
    await fetch("/api/products", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setPageLoading(false);
    showToast("Product deleted", "success");
    loadProducts();
  };

  // ── CATEGORIES ───────────────────────────
  const handleAddCategory = async (e) => {
    e.preventDefault();
    setUploading(true);
    let imageUrl = editingCategory?.image || "";
    if (categoryImage) imageUrl = await uploadImage(categoryImage);
    setUploading(false);
    if (!imageUrl) {
      showToast("Image upload failed", "error");
      return;
    }

    setPageLoading(true);
    const url = "/api/categories";
    const method = editingCategory ? "PUT" : "POST";
    const body = editingCategory
      ? { id: editingCategory.id, name: categoryForm.name, image: imageUrl }
      : { name: categoryForm.name, image: imageUrl };

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    setPageLoading(false);

    if (res.ok) {
      showToast(
        editingCategory ? "Category updated" : "Category added",
        "success",
      );
    } else {
      showToast("Failed to save category", "error");
    }

    setCategoryForm({ name: "", image: "" });
    setCategoryImage(null);
    setEditingCategory(null);
    setShowCategoryModal(false);
    loadCategories();
  };

  const handleDeleteCategory = async (id) => {
    if (!confirm("Delete this category?")) return;
    setPageLoading(true);
    await fetch("/api/categories", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setPageLoading(false);
    showToast("Category deleted", "success");
    loadCategories();
  };

  // ── BANNERS ──────────────────────────────
  const handleAddBanner = async (e) => {
    e.preventDefault();
    setUploading(true);
    let imageUrl = editingBanner?.image || "";
    if (bannerImage) imageUrl = await uploadImage(bannerImage);
    setUploading(false);
    if (!imageUrl) {
      showToast("Image upload failed", "error");
      return;
    }

    setPageLoading(true);
    const url = "/api/banners";
    const method = editingBanner ? "PUT" : "POST";
    const body = editingBanner
      ? {
          id: editingBanner.id,
          title: bannerForm.title,
          subtitle: bannerForm.subtitle,
          cta: bannerForm.cta,
          image: imageUrl,
          order: bannerForm.order,
          active: bannerForm.active,
        }
      : {
          title: bannerForm.title,
          subtitle: bannerForm.subtitle,
          cta: bannerForm.cta,
          image: imageUrl,
          order: bannerForm.order || 0,
          active: bannerForm.active !== false,
        };

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    setPageLoading(false);

    if (res.ok) {
      showToast(editingBanner ? "Banner updated" : "Banner added", "success");
    } else {
      showToast("Failed to save banner", "error");
    }

    setBannerForm({
      title: "",
      subtitle: "",
      cta: "",
      image: "",
      order: 0,
      active: true,
    });
    setBannerImage(null);
    setEditingBanner(null);
    setShowBannerModal(false);
    loadBanners();
  };

  const handleDeleteBanner = async (id) => {
    if (!confirm("Delete this banner?")) return;
    setPageLoading(true);
    await fetch("/api/banners", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setPageLoading(false);
    showToast("Banner deleted", "success");
    loadBanners();
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    setPageLoading(true);
    try {
      await updateDoc(doc(db, "orders", orderId), { status: newStatus });
      showToast(`Order marked as ${newStatus}`, "success");
      loadAnalytics();
    } catch (err) {
      console.error("Failed to update order status:", err);
      showToast("Failed to update status", "error");
    } finally {
      setPageLoading(false);
    }
  };

  const handleToggleBanner = async (banner) => {
    const newActive = !banner.active;
    await fetch("/api/banners", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: banner.id, active: newActive }),
    });
    showToast(newActive ? "Banner activated" : "Banner hidden", "info");
    loadBanners();
  };

  // ── Loading Overlay ──────────────────────
  const LoadingOverlay = () => (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(255,255,255,0.7)",
        backdropFilter: "blur(4px)",
        zIndex: 9998,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          background: "var(--white)",
          padding: "20px 32px",
          borderRadius: "var(--radius-md)",
          boxShadow: "0 12px 40px rgba(139,0,0,0.15)",
          display: "flex",
          alignItems: "center",
          gap: 12,
          fontFamily: "var(--font-body)",
          fontSize: "0.85rem",
          color: "var(--crimson)",
          fontWeight: 500,
        }}
      >
        <div
          style={{
            width: 22,
            height: 22,
            border: "2.5px solid rgba(139,0,0,0.12)",
            borderTopColor: "var(--crimson)",
            borderRadius: "50%",
            animation: "admin-spin 0.7s linear infinite",
          }}
        />
        Processing...
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="admin-spinner" />
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="admin-login-wrapper">
        {pageLoading && <LoadingOverlay />}
        {toast && <Toast {...toast} onClose={() => setToast(null)} />}
        <div className="admin-login-card">
          <div className="section-header centered">
            <span className="section-label">Administration</span>
            <h1 className="section-title" style={{ marginBottom: 4 }}>
              WeCozmo
            </h1>
            <p className="section-subtitle">Secure Dashboard Access</p>
          </div>
          {error && <div className="admin-error">{error}</div>}
          <form onSubmit={handleLogin} className="admin-login-form">
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-control"
                placeholder="admin@wecozmo.com"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-control"
                placeholder="••••••••"
                required
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary w-100 mt-2"
              disabled={pageLoading}
            >
              Sign In to Dashboard
            </button>
          </form>
          <p className="admin-login-footer d-flex flex-column">
            Authorized personnel only
            <a href="/">
              <u>Back to Home</u>
            </a>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      {pageLoading && <LoadingOverlay />}
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      <header className="admin-header">
        <button
          className="admin-hamburger"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <span />
          <span />
          <span />
        </button>
        <span className="admin-brand">
          WeCozmo <small>Admin</small>
        </span>
        <div className="admin-header-actions">
          <span className="admin-user-email">{user.email}</span>
          <button
            onClick={handleLogout}
            className="btn btn-outline-primary btn-sm"
          >
            Logout
          </button>
        </div>
      </header>

      <div className="admin-layout">
        {sidebarOpen && (
          <div
            className="admin-overlay"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        <aside
          className={`admin-sidebar ${sidebarOpen ? "admin-sidebar--open" : ""}`}
        >
          <nav className="admin-nav">
            {[
              { key: "analytics", label: "Analytics" },
              { key: "products", label: "Products" },
              { key: "categories", label: "Categories" },
              { key: "banners", label: "Banners" },
              { key: "orders", label: "Orders" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => {
                  setActiveTab(tab.key);
                  setSidebarOpen(false);
                }}
                className={`admin-nav-link ${activeTab === tab.key ? "admin-nav-link--active" : ""}`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </aside>

        <main className="admin-content">
          {/* ══════ ANALYTICS ══════ */}
          {activeTab === "analytics" && (
            <div>
              <div className="section-header">
                <span className="section-label">Overview</span>
                <h2
                  className="section-title"
                  style={{ fontSize: "clamp(1.3rem, 3vw, 1.8rem)" }}
                >
                  Analytics
                </h2>
                <p className="section-subtitle">Store performance metrics</p>
              </div>
              <div className="admin-stat-row">
                {[
                  {
                    label: "Product Views",
                    value: analytics?.totalViews || 0,
                    color: "var(--crimson)",
                  },
                  {
                    label: "Added to Cart",
                    value: analytics?.totalAddToCart || 0,
                    color: "#00c48c",
                  },
                  {
                    label: "Orders",
                    value: analytics?.totalOrders || 0,
                    color: "var(--gold-dark)",
                  },
                  {
                    label: "Revenue",
                    value: `Rs. ${(analytics?.totalRevenue || 0).toFixed(0)}`,
                    color: "var(--rose)",
                  },
                ].map((s, i) => (
                  <div key={i} className="admin-stat">
                    <span className="admin-stat-label">{s.label}</span>
                    <span
                      className="admin-stat-number"
                      style={{ color: s.color }}
                    >
                      {s.value}
                    </span>
                  </div>
                ))}
              </div>
              <div className="contact-card">
                <h6
                  style={{
                    color: "var(--crimson)",
                    marginBottom: 12,
                    fontFamily: "var(--font-display)",
                  }}
                >
                  Top Search Terms
                </h6>
                {analytics?.topSearches?.length > 0 ? (
                  <div className="filter-scroll">
                    {analytics.topSearches.map((s, i) => (
                      <span
                        key={i}
                        className="filter-btn active"
                        style={{ cursor: "default" }}
                      >
                        &ldquo;{s.term}&rdquo; ({s.count})
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="section-subtitle">No search data yet</p>
                )}
              </div>
            </div>
          )}

          {/* ══════ PRODUCTS ══════ */}
          {activeTab === "products" && (
            <div>
              <div className="admin-section-header">
                <div>
                  <span className="section-label">Catalog</span>
                  <h2
                    className="section-title"
                    style={{ fontSize: "clamp(1.3rem, 3vw, 1.8rem)" }}
                  >
                    Products
                  </h2>
                  <p className="section-subtitle">{products.length} items</p>
                </div>
                <button
                  onClick={() => {
                    setEditingProduct(null);
                    setProductForm({
                      name: "",
                      price: "",
                      originalPrice: "",
                      category: "",
                      description: "",
                      stock: "",
                    });
                    setProductImage(null);
                    setShowProductModal(true);
                  }}
                  className="btn btn-primary"
                >
                  Add Product
                </button>
              </div>
              <div className="admin-card-grid">
                {products.map((p) => (
                  <div
                    key={p.id}
                    className="admin-card-item"
                    style={
                      p.inStock === false
                        ? { opacity: 0.6, transition: "opacity 0.3s ease" }
                        : {}
                    }
                  >
                    <img
                      src={p.image}
                      alt={p.name}
                      className="admin-card-image"
                    />
                    <div className="admin-card-body">
                      <h4 className="admin-card-title">{p.name}</h4>
                      <div className="admin-card-meta">
                        <span className="admin-chip">{p.category}</span>
                        <span className="admin-card-subtitle">
                          Stock: {p.stock || 0}
                        </span>
                        {p.inStock === false && (
                          <span className="admin-chip admin-chip--pending">
                            Inactive
                          </span>
                        )}
                      </div>
                      <span className="admin-card-price">Rs. {p.price}</span>
                      <div className="admin-card-actions">
                        <button
                          onClick={() => {
                            setEditingProduct(p);
                            setProductForm({
                              name: p.name,
                              price: p.price?.toString() || "",
                              originalPrice: p.originalPrice?.toString() || "",
                              category: p.category || "",
                              description: p.description || "",
                              stock: (p.stock || 0).toString(),
                            });
                            setProductImage(null);
                            setShowProductModal(true);
                          }}
                          className="admin-action-btn"
                          title="Edit"
                        >
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(p.id)}
                          className="admin-action-btn admin-action-delete"
                          title="Delete"
                        >
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ══════ CATEGORIES ══════ */}
          {activeTab === "categories" && (
            <div>
              <div className="admin-section-header">
                <div>
                  <span className="section-label">Browse</span>
                  <h2
                    className="section-title"
                    style={{ fontSize: "clamp(1.3rem, 3vw, 1.8rem)" }}
                  >
                    Categories
                  </h2>
                  <p className="section-subtitle">
                    {categories.length} categories
                  </p>
                </div>
                <button
                  onClick={() => {
                    setEditingCategory(null);
                    setCategoryForm({ name: "", image: "" });
                    setCategoryImage(null);
                    setShowCategoryModal(true);
                  }}
                  className="btn btn-primary"
                >
                  Add Category
                </button>
              </div>
              <div className="admin-card-grid">
                {categories.map((cat) => (
                  <div key={cat.id} className="admin-card-item">
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="admin-card-image"
                    />
                    <div className="admin-card-body">
                      <h4 className="admin-card-title">{cat.name}</h4>
                      <div
                        className="admin-card-actions"
                        style={{ marginTop: "auto" }}
                      >
                        <button
                          onClick={() => {
                            setEditingCategory(cat);
                            setCategoryForm({ name: cat.name, image: "" });
                            setCategoryImage(null);
                            setShowCategoryModal(true);
                          }}
                          className="admin-action-btn"
                          title="Edit"
                        >
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(cat.id)}
                          className="admin-action-btn admin-action-delete"
                          title="Delete"
                        >
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ══════ BANNERS ══════ */}
          {activeTab === "banners" && (
            <div>
              <div className="admin-section-header">
                <div>
                  <span className="section-label">Hero</span>
                  <h2
                    className="section-title"
                    style={{ fontSize: "clamp(1.3rem, 3vw, 1.8rem)" }}
                  >
                    Banners
                  </h2>
                  <p className="section-subtitle">{banners.length} banners</p>
                </div>
                <button
                  onClick={() => {
                    setEditingBanner(null);
                    setBannerForm({
                      title: "",
                      subtitle: "",
                      cta: "",
                      image: "",
                      order: 0,
                      active: true,
                    });
                    setBannerImage(null);
                    setShowBannerModal(true);
                  }}
                  className="btn btn-primary"
                >
                  Add Banner
                </button>
              </div>
              <div className="admin-card-grid">
                {banners.map((b) => (
                  <div
                    key={b.id}
                    className="admin-card-item"
                    style={
                      b.active === false
                        ? { opacity: 0.5, transition: "opacity 0.3s ease" }
                        : {}
                    }
                  >
                    <img
                      src={b.image}
                      alt={b.title}
                      className="admin-card-image"
                    />
                    <div className="admin-card-body">
                      <h4 className="admin-card-title">{b.title}</h4>
                      <p className="admin-card-subtitle">{b.subtitle}</p>
                      <div className="admin-card-meta">
                        <span className="admin-chip">{b.cta}</span>
                        <span
                          className={`admin-chip ${b.active !== false ? "admin-chip--done" : "admin-chip--pending"}`}
                        >
                          {b.active !== false ? "Active" : "Hidden"}
                        </span>
                      </div>
                      <div className="admin-card-actions">
                        <button
                          onClick={() => handleToggleBanner(b)}
                          className="admin-action-btn"
                          title={b.active !== false ? "Hide" : "Activate"}
                        >
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                        </button>
                        <button
                          onClick={() => {
                            setEditingBanner(b);
                            setBannerForm({
                              title: b.title,
                              subtitle: b.subtitle || "",
                              cta: b.cta || "",
                              image: "",
                              order: b.order || 0,
                              active: b.active !== false,
                            });
                            setBannerImage(null);
                            setShowBannerModal(true);
                          }}
                          className="admin-action-btn"
                          title="Edit"
                        >
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDeleteBanner(b.id)}
                          className="admin-action-btn admin-action-delete"
                          title="Delete"
                        >
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ══════ ORDERS ══════ */}
          {activeTab === "orders" && (
            <div>
              <div className="section-header">
                <span className="section-label">Management</span>
                <h2
                  className="section-title"
                  style={{ fontSize: "clamp(1.3rem, 3vw, 1.8rem)" }}
                >
                  Orders
                </h2>
                <p className="section-subtitle">
                  {analytics?.recentOrders?.length || 0} total orders
                </p>
              </div>
              <div className="filter-scroll" style={{ marginBottom: 18 }}>
                {["all", "pending", "processing", "delivered"].map((status) => (
                  <button
                    key={status}
                    onClick={() => setOrderFilter(status)}
                    className={`filter-btn ${orderFilter === status ? "active" : ""}`}
                  >
                    {status === "all"
                      ? "All Orders"
                      : status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>
              {analytics?.recentOrders?.length > 0 ? (
                <div className="admin-order-list">
                  {analytics.recentOrders
                    .filter(
                      (order) =>
                        orderFilter === "all" || order.status === orderFilter,
                    )
                    .map((order, i) => (
                      <div key={i} className="contact-card admin-order-item">
                        <div className="admin-order-head">
                          <div>
                            <strong>
                              {order.customer?.name || "Customer"}
                            </strong>
                            <span
                              style={{
                                marginLeft: 10,
                                fontSize: "0.7rem",
                                color: "var(--text-muted)",
                              }}
                            >
                              #{order.id?.slice(-6) || i + 1}
                            </span>
                          </div>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 8,
                            }}
                          >
                            <select
                              value={order.status || "pending"}
                              onChange={(e) =>
                                handleUpdateOrderStatus(
                                  order.id,
                                  e.target.value,
                                )
                              }
                              style={{
                                padding: "4px 24px 4px 8px",
                                fontSize: "0.7rem",
                                borderRadius: "var(--radius-sm)",
                                border: "1.5px solid rgba(139,0,0,0.15)",
                                background: "var(--white)",
                                cursor: "pointer",
                              }}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <option value="pending">Pending</option>
                              <option value="processing">Processing</option>
                              <option value="delivered">Delivered</option>
                            </select>
                            <span
                              className={`admin-chip ${order.status === "pending" ? "admin-chip--pending" : "admin-chip--done"}`}
                            >
                              {order.status || "pending"}
                            </span>
                          </div>
                        </div>
                        <div className="admin-order-meta">
                          <span>{order.customer?.phone}</span>
                          <span>{order.customer?.city}</span>
                          <span>{order.date}</span>
                        </div>
                        {order.items && order.items.length > 0 && (
                          <div
                            style={{
                              margin: "8px 0",
                              padding: "8px 12px",
                              background: "var(--pearl)",
                              borderRadius: "var(--radius-sm)",
                              fontSize: "0.75rem",
                            }}
                          >
                            {order.items.map((item, idx) => (
                              <div
                                key={idx}
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  padding: "2px 0",
                                }}
                              >
                                <span>
                                  {item.name} x{item.quantity}
                                </span>
                                <span style={{ color: "var(--text-muted)" }}>
                                  Rs.{" "}
                                  {(
                                    (item.price || 0) * (item.quantity || 1)
                                  ).toFixed(0)}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                        {order.customer?.address && (
                          <p
                            className="admin-order-meta"
                            style={{ marginBottom: 0 }}
                          >
                            {order.customer.address}
                            {order.customer.notes &&
                              order.customer.notes !== "None" && (
                                <span
                                  style={{
                                    marginLeft: 12,
                                    fontStyle: "italic",
                                  }}
                                >
                                  Note: {order.customer.notes}
                                </span>
                              )}
                          </p>
                        )}
                        <p
                          className="admin-order-total"
                          style={{ marginTop: 8 }}
                        >
                          Total:{" "}
                          <strong style={{ color: "var(--crimson)" }}>
                            Rs. {(order.total || 0).toFixed(0)}
                          </strong>
                        </p>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="contact-card">
                  <p
                    className="section-subtitle text-center"
                    style={{ padding: "30px 0" }}
                  >
                    No orders yet
                  </p>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* ══════ PRODUCT MODAL ══════ */}
      {showProductModal && (
        <div
          className="admin-modal-overlay"
          onClick={() => {
            setShowProductModal(false);
            setEditingProduct(null);
          }}
        >
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  color: "var(--crimson)",
                  margin: 0,
                }}
              >
                {editingProduct ? "Edit Product" : "Add Product"}
              </h3>
              <button
                onClick={() => {
                  setShowProductModal(false);
                  setEditingProduct(null);
                }}
                className="admin-modal-close"
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleAddProduct} className="admin-modal-body">
              <div className="admin-form-2col">
                <div>
                  <label className="form-label">Name</label>
                  <input
                    type="text"
                    value={productForm.name}
                    onChange={(e) =>
                      setProductForm({ ...productForm, name: e.target.value })
                    }
                    className="form-control"
                    required
                  />
                </div>
                <div>
                  <label className="form-label">Price (Rs.)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={productForm.price}
                    onChange={(e) =>
                      setProductForm({ ...productForm, price: e.target.value })
                    }
                    className="form-control"
                    required
                  />
                </div>
                <div>
                  <label className="form-label">Original Price</label>
                  <input
                    type="number"
                    step="0.01"
                    value={productForm.originalPrice}
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        originalPrice: e.target.value,
                      })
                    }
                    className="form-control"
                  />
                </div>
                <div>
                  <label className="form-label">Category</label>
                  <select
                    value={productForm.category}
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        category: e.target.value,
                      })
                    }
                    className="form-control"
                    required
                  >
                    <option value="">-- Select --</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="form-label">Stock</label>
                  <input
                    type="number"
                    value={productForm.stock}
                    onChange={(e) =>
                      setProductForm({ ...productForm, stock: e.target.value })
                    }
                    className="form-control"
                    required
                  />
                </div>
                <div>
                  <label className="form-label">
                    Image {editingProduct && "(leave empty to keep current)"}
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setProductImage(e.target.files[0])}
                    className="form-control"
                    required={!editingProduct}
                  />
                </div>
                <div className="admin-form-full">
                  <label className="form-label">Description</label>
                  <textarea
                    value={productForm.description}
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        description: e.target.value,
                      })
                    }
                    className="form-control"
                    rows={3}
                  />
                </div>
              </div>
              <div className="admin-modal-actions">
                <button
                  type="button"
                  onClick={() => {
                    setShowProductModal(false);
                    setEditingProduct(null);
                  }}
                  className="btn btn-outline-primary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="btn btn-primary"
                >
                  {uploading
                    ? "Saving..."
                    : editingProduct
                      ? "Update Product"
                      : "Add Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ══════ CATEGORY MODAL ══════ */}
      {showCategoryModal && (
        <div
          className="admin-modal-overlay"
          onClick={() => {
            setShowCategoryModal(false);
            setEditingCategory(null);
          }}
        >
          <div
            className="admin-modal"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: 450 }}
          >
            <div className="admin-modal-header">
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  color: "var(--crimson)",
                  margin: 0,
                }}
              >
                {editingCategory ? "Edit Category" : "Add Category"}
              </h3>
              <button
                onClick={() => {
                  setShowCategoryModal(false);
                  setEditingCategory(null);
                }}
                className="admin-modal-close"
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleAddCategory} className="admin-modal-body">
              <div
                style={{ display: "flex", flexDirection: "column", gap: 14 }}
              >
                <div>
                  <label className="form-label">Category Name</label>
                  <input
                    type="text"
                    value={categoryForm.name}
                    onChange={(e) =>
                      setCategoryForm({ ...categoryForm, name: e.target.value })
                    }
                    className="form-control"
                    required
                  />
                </div>
                <div>
                  <label className="form-label">
                    Image {editingCategory && "(leave empty to keep current)"}
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setCategoryImage(e.target.files[0])}
                    className="form-control"
                    required={!editingCategory}
                  />
                </div>
              </div>
              <div className="admin-modal-actions">
                <button
                  type="button"
                  onClick={() => {
                    setShowCategoryModal(false);
                    setEditingCategory(null);
                  }}
                  className="btn btn-outline-primary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="btn btn-primary"
                >
                  {uploading
                    ? "Saving..."
                    : editingCategory
                      ? "Update Category"
                      : "Add Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ══════ BANNER MODAL ══════ */}
      {showBannerModal && (
        <div
          className="admin-modal-overlay"
          onClick={() => {
            setShowBannerModal(false);
            setEditingBanner(null);
          }}
        >
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  color: "var(--crimson)",
                  margin: 0,
                }}
              >
                {editingBanner ? "Edit Banner" : "Add Banner"}
              </h3>
              <button
                onClick={() => {
                  setShowBannerModal(false);
                  setEditingBanner(null);
                }}
                className="admin-modal-close"
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleAddBanner} className="admin-modal-body">
              <div className="admin-form-2col">
                <div>
                  <label className="form-label">Title</label>
                  <input
                    type="text"
                    value={bannerForm.title}
                    onChange={(e) =>
                      setBannerForm({ ...bannerForm, title: e.target.value })
                    }
                    className="form-control"
                    required
                  />
                </div>
                <div>
                  <label className="form-label">CTA Text</label>
                  <input
                    type="text"
                    value={bannerForm.cta}
                    onChange={(e) =>
                      setBannerForm({ ...bannerForm, cta: e.target.value })
                    }
                    className="form-control"
                    required
                  />
                </div>
                <div className="admin-form-full">
                  <label className="form-label">Subtitle</label>
                  <input
                    type="text"
                    value={bannerForm.subtitle}
                    onChange={(e) =>
                      setBannerForm({ ...bannerForm, subtitle: e.target.value })
                    }
                    className="form-control"
                    required
                  />
                </div>
                <div>
                  <label className="form-label">Display Order</label>
                  <input
                    type="number"
                    value={bannerForm.order}
                    onChange={(e) =>
                      setBannerForm({
                        ...bannerForm,
                        order: parseInt(e.target.value),
                      })
                    }
                    className="form-control"
                  />
                </div>
                <div className="admin-form-full">
                  <label className="form-label">
                    Image {editingBanner && "(leave empty to keep current)"}
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setBannerImage(e.target.files[0])}
                    className="form-control"
                    required={!editingBanner}
                  />
                </div>
              </div>
              <div className="admin-modal-actions">
                <button
                  type="button"
                  onClick={() => {
                    setShowBannerModal(false);
                    setEditingBanner(null);
                  }}
                  className="btn btn-outline-primary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="btn btn-primary"
                >
                  {uploading
                    ? "Saving..."
                    : editingBanner
                      ? "Update Banner"
                      : "Add Banner"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
