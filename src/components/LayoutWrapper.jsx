"use client";

import { useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import WhatsAppButton from "./WhatsAppButton";

export default function LayoutWrapper({ children }) {
  useEffect(() => {
    import("bootstrap/dist/js/bootstrap.bundle");
  }, []);

  return (
    <>
      <Header />
      <main className="main-content">{children}</main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
