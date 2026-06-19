"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { products } from "@/data/products";
import ProductCard from "@/components/ProductCard";

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");

  const [selectedCategory, setSelectedCategory] = useState(
    categoryParam || "All",
  );
  const [searchQuery, setSearchQuery] = useState("");

  // Sync category from URL param on mount
  useEffect(() => {
    if (categoryParam) setSelectedCategory(categoryParam);
  }, [categoryParam]);

  const categories = useMemo(
    () => ["All", ...new Set(products.map((p) => p.category))],
    [],
  );

  const filteredProducts = useMemo(() => {
    let list = products;

    if (selectedCategory && selectedCategory !== "All") {
      list = list.filter((p) => p.category === selectedCategory);
    }

    const q = searchQuery.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (p) =>
          p.name?.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q),
      );
    }

    return list;
  }, [selectedCategory, searchQuery]);

  return (
    <div className="container">
      {/* ── Page Header ── */}
      <div className="products-page-header">
        <span className="section-label">Our Collection</span>
        <h1 className="mb-1">All Products</h1>
        <p className="text-muted" style={{ fontSize: "0.9rem" }}>
          {filteredProducts.length} product
          {filteredProducts.length !== 1 ? "s" : ""} found
        </p>
      </div>

      <hr className="divider-gradient" />

      {/* ── Search + Filter Row ── */}
      <div className="d-flex flex-column flex-md-row align-items-md-center gap-3 mb-4">
        {/* Search */}
        <div className="search-wrap flex-shrink-0">
          <i className="bi bi-search search-icon"></i>
          <input
            type="text"
            className="form-control"
            placeholder="Search products…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search products"
          />
        </div>

        {/* Category Pills */}
        <div className="filter-scroll flex-grow-1">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`filter-btn${selectedCategory === cat ? " active" : ""}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ── Product Grid ── */}
      {filteredProducts.length > 0 ? (
        <div className="row row-cols-2 row-cols-md-3 row-cols-lg-4 g-3 g-md-4 product-card-wrap">
          {filteredProducts.map((product) => (
            <div className="col" key={product.id} data-aos="fade-up">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      ) : (
        <div className="no-results">
          <i className="bi bi-search"></i>
          <h5
            style={{
              color: "var(--text-muted)",
              fontFamily: "var(--font-display)",
            }}
          >
            No products found
          </h5>
          <p style={{ fontSize: "0.88rem" }}>
            Try adjusting your search or category filter.
          </p>
          <button
            className="btn btn-outline-primary mt-2"
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("All");
            }}
          >
            Clear filters
          </button>
        </div>
      )}

      {/* Bottom spacer */}
      <div style={{ height: "3rem" }} />
    </div>
  );
}
