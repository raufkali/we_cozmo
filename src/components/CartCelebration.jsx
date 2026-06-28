"use client";
import { useEffect, useRef } from "react";

// Theme-specific celebration colors
const themeColors = {
  crimson: ["#e74c3c", "#ff6b7a", "#c0392b", "#ff4444", "#d4af37", "#f0e68c"],
  gold: ["#d4af37", "#f0e68c", "#b8860b", "#ffd700", "#fff8dc", "#daa520"],
  dark: ["#ff6b7a", "#e74c3c", "#d4af37", "#ff4444", "#f0e68c", "#ff8a95"],
  blue: ["#3b82f6", "#93c5fd", "#60a5fa", "#c0a060", "#e8d5a3", "#2563eb"],
};

export default function CartCelebration() {
  const containerRef = useRef(null);
  const activeTheme = useRef("crimson");

  // Track theme changes
  useEffect(() => {
    activeTheme.current =
      document.documentElement.getAttribute("data-theme") || "crimson";

    const observer = new MutationObserver(() => {
      activeTheme.current =
        document.documentElement.getAttribute("data-theme") || "crimson";
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    return () => observer.disconnect();
  }, []);

  const celebrate = (x, y) => {
    const container = containerRef.current;
    if (!container) return;

    const colors = themeColors[activeTheme.current] || themeColors.crimson;
    const particleCount = 30;

    // Create burst particles
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement("div");
      particle.className = "celebration-particle";

      // Random size
      const size = Math.random() * 8 + 4;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;

      // Position at click/cart location
      particle.style.left = `${x}px`;
      particle.style.top = `${y}px`;

      // Random color from theme
      particle.style.background =
        colors[Math.floor(Math.random() * colors.length)];
      particle.style.color = colors[Math.floor(Math.random() * colors.length)];

      // Random shape
      if (Math.random() > 0.5) {
        particle.style.borderRadius = "50%"; // Circle
      } else if (Math.random() > 0.5) {
        particle.style.borderRadius = "2px"; // Square
        particle.style.transform = "rotate(45deg)";
      } else {
        particle.style.borderRadius = "50% 0 50% 0"; // Fancy shape
      }

      // Random burst direction
      const angle =
        (Math.PI * 2 * i) / particleCount + (Math.random() - 0.5) * 0.5;
      const distance = Math.random() * 150 + 60;

      particle.style.setProperty(
        "--tx20",
        `${Math.cos(angle) * distance * 0.2}px`,
      );
      particle.style.setProperty(
        "--ty20",
        `${Math.sin(angle) * distance * 0.2 - 30}px`,
      );
      particle.style.setProperty(
        "--tx60",
        `${Math.cos(angle) * distance * 0.6}px`,
      );
      particle.style.setProperty(
        "--ty60",
        `${Math.sin(angle) * distance * 0.6 - 80}px`,
      );
      particle.style.setProperty("--tx100", `${Math.cos(angle) * distance}px`);
      particle.style.setProperty(
        "--ty100",
        `${Math.sin(angle) * distance - 120}px`,
      );

      container.appendChild(particle);

      particle.addEventListener("animationend", () => particle.remove());
    }

    // Create confetti strips
    for (let i = 0; i < 15; i++) {
      const confetti = document.createElement("div");
      confetti.className = "celebration-particle confetti-strip";

      confetti.style.width = `${Math.random() * 8 + 4}px`;
      confetti.style.height = `${Math.random() * 16 + 8}px`;
      confetti.style.left = `${x + (Math.random() - 0.5) * 200}px`;
      confetti.style.top = `${y - 20}px`;
      confetti.style.background =
        colors[Math.floor(Math.random() * colors.length)];
      confetti.style.borderRadius = "2px";

      container.appendChild(confetti);
      confetti.addEventListener("animationend", () => confetti.remove());
    }

    // Center sparkle flash
    const sparkle = document.createElement("div");
    sparkle.className = "celebration-sparkle";
    sparkle.style.left = `${x}px`;
    sparkle.style.top = `${y}px`;
    sparkle.style.width = "60px";
    sparkle.style.height = "60px";
    sparkle.style.marginLeft = "-30px";
    sparkle.style.marginTop = "-30px";

    container.appendChild(sparkle);
    sparkle.addEventListener("animationend", () => sparkle.remove());
  };

  // Expose celebrate function globally so CartContext can call it
  useEffect(() => {
    window.cartCelebrate = celebrate;
    return () => {
      delete window.cartCelebrate;
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="cart-celebration-container"
      aria-hidden="true"
    />
  );
}
