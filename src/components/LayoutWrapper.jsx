"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";
import WhatsAppButton from "./WhatsAppButton";

export default function LayoutWrapper({ children }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/secret");

  useEffect(() => {
    import("bootstrap/dist/js/bootstrap.bundle");
  }, []);

  if (isAdmin) {
    return <main className="main-content">{children}</main>;
  }

  return (
    <>
      <Header />
      <main className="main-content">{children}</main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
