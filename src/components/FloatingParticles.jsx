"use client";
import { useEffect, useRef } from "react";

export default function FloatingParticles() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const isMobile = window.innerWidth < 768;

    const createParticle = () => {
      const particle = document.createElement("div");
      particle.className = "particle";

      const size = Math.random() * 3 + 2;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.animationDuration = `${Math.random() * 8 + 6}s`;
      particle.style.animationDelay = `${Math.random() * 4}s`;

      container.appendChild(particle);

      particle.addEventListener("animationend", () => {
        particle.remove();
      });
    };

    // Create initial particles
    const initialCount = isMobile ? 8 : 15;
    for (let i = 0; i < initialCount; i++) {
      setTimeout(createParticle, i * 250);
    }

    // Continue creating
    const intervalTime = isMobile ? 1000 : 500;
    const interval = setInterval(createParticle, intervalTime);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      ref={containerRef}
      className="particles-container"
      aria-hidden="true"
    />
  );
}
