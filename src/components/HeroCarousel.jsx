"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const slides = [
  {
    id: 1,
    image: "/images/banners/banner1.jpg",
    title: "Summer Glow",
    subtitle: "Up to 30% off on skincare essentials",
    cta: "Shop Now",
    link: "/products?category=Skincare",
  },
  {
    id: 2,
    image: "/images/banners/banner2.jpg",
    title: "New Arrivals",
    subtitle: "Explore the latest makeup collection",
    cta: "Discover",
    link: "/products?category=Makeup",
  },
  {
    id: 3,
    image: "/images/banners/banner3.jpg",
    title: "Luxury Fragrance",
    subtitle: "Limited time offers — smell divine",
    cta: "Grab Deal",
    link: "/products?category=Fragrance",
  },
];

const TICKER_ITEMS = [
  "✦ Free delivery on orders above Rs. 2,000",
  "✦ 100% Original & Authentic Products",
  "✦ Cruelty-Free Beauty — Always",
  "✦ New Arrivals Every Week",
  "✦ Pakistan's Premier Cosmetics Destination",
  "✦ Luxury Skincare Starting at Rs. 599",
  "✦ Exclusive Members-Only Deals",
  "✦ Fragrance, Makeup & More",
];

export default function HeroCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [paused]);

  const prev = () =>
    setActiveIndex((p) => (p - 1 + slides.length) % slides.length);
  const next = () => setActiveIndex((p) => (p + 1) % slides.length);

  // Duplicate for seamless loop
  const tickerAll = [...TICKER_ITEMS, ...TICKER_ITEMS];

  return (
    <div className="hero-carousel-wrap">
      {/* ── Carousel ── */}
      <div
        id="heroCarousel"
        className="carousel slide hero-carousel"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* Indicators */}
        <div className="carousel-indicators">
          {slides.map((_, idx) => (
            <button
              key={idx}
              type="button"
              className={idx === activeIndex ? "active" : ""}
              aria-label={`Slide ${idx + 1}`}
              onClick={() => setActiveIndex(idx)}
            />
          ))}
        </div>

        {/* Slides */}
        <div className="carousel-inner">
          {slides.map((slide, idx) => (
            <div
              key={slide.id}
              className={`carousel-item${idx === activeIndex ? " active" : ""}`}
            >
              <img
                src={slide.image}
                className="d-block w-100"
                alt={slide.title}
              />
              <div className="carousel-caption d-none d-md-block">
                <h3>{slide.title}</h3>
                <p>{slide.subtitle}</p>
                <Link href={slide.link} className="btn btn-primary mt-1">
                  {slide.cta}
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Controls */}
        <button
          className="carousel-control-prev"
          type="button"
          onClick={prev}
          aria-label="Previous"
        >
          <span
            className="carousel-control-prev-icon"
            aria-hidden="true"
          ></span>
        </button>
        <button
          className="carousel-control-next"
          type="button"
          onClick={next}
          aria-label="Next"
        >
          <span
            className="carousel-control-next-icon"
            aria-hidden="true"
          ></span>
        </button>
      </div>

      {/* ── Animated Ticker ── */}
      <div className="ticker-wrap" role="marquee" aria-label="Promotions">
        <div className="ticker-track">
          {tickerAll.map((text, i) => (
            <span key={i} className="ticker-item">
              {text}
              {i < tickerAll.length - 1 && (
                <span className="ticker-dot" aria-hidden="true" />
              )}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
