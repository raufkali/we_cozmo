// components/ClientLayout.js
"use client";

import { useEffect } from "react";
import AOS from "aos";
import { CartProvider } from "@/context/CartContext";
import LayoutWrapper from "@/components/LayoutWrapper";
import SmoothScrollProvider from "@/components/SmoothScroll";
import CartCelebration from "@/components/CartCelebration";

export default function ClientLayout({ children }) {
  useEffect(() => {
    if (typeof window !== "undefined") {
      AOS.init({
        duration: 800,
        easing: "ease-in-out",
        once: true,
        offset: 50,
      });
    }
  }, []);

  return (
    <CartProvider>
      <LayoutWrapper>
        <SmoothScrollProvider>
          <CartCelebration />
          {children}
        </SmoothScrollProvider>
      </LayoutWrapper>
    </CartProvider>
  );
}
