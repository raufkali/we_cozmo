"use client";

export default function WhatsAppButton() {
  const phoneNumber = process.env.NEXT_PUBLIC_PHONE || "+923001234567";
  const cleanPhone = phoneNumber.replace(/[\s\+\-\(\)]/g, "");
  const message = "Hi! I have a question about your products.";

  return (
    <a
      href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`}
      className="whatsapp-fab"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
    >
      <i className="fab fa-whatsapp"></i>
    </a>
  );
}
