"use client";

import { useState, useEffect, useRef } from "react";
import AOS from "aos";

export default function FAQ() {
  const [activeIndex, setActiveIndex] = useState(null);
  const [mounted, setMounted] = useState(false);
  const contentRefs = useRef([]);

  useEffect(() => {
    setMounted(true);
    AOS.refresh();
  }, []);

  useEffect(() => {
    AOS.refresh();
  }, [activeIndex]);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "Are your products authentic and original?",
      answer:
        "Absolutely! We source all our cosmetics and skincare products directly from authorized distributors and trusted manufacturers. Every product is 100% genuine and authentic, ensuring you receive the quality you deserve.",
      icon: "fa-shield-halved",
    },
    {
      question: "How long does delivery take in Pakistan?",
      answer:
        "We offer fast delivery across Pakistan! Orders in major cities like Lahore, Karachi, and Islamabad typically arrive within 2-3 business days. For other cities, delivery takes 3-5 business days. You'll receive tracking information via WhatsApp once your order ships.",
      icon: "fa-truck-fast",
    },
    {
      question: "What is your return and exchange policy?",
      answer:
        "We stand behind our products! If you receive a damaged or incorrect item, contact us within 24 hours of delivery. We'll arrange a free replacement or refund. For change of mind returns, items must be unopened and in original packaging within 7 days.",
      icon: "fa-arrow-rotate-left",
    },
    {
      question: "How can I find the right skincare product for my skin type?",
      answer:
        "We categorize our products by skin type and concern! You can browse by category on our website or contact us on WhatsApp for personalized recommendations. We'll help you find the perfect match for your skin type - whether it's oily, dry, combination, or sensitive.",
      icon: "fa-heart-pulse",
    },
    {
      question: "Do you offer Cash on Delivery (COD)?",
      answer:
        "Yes, we do! Cash on Delivery is available across Pakistan. You can pay when you receive your order. We also accept bank transfers and online payments for your convenience. COD orders are verified via phone or WhatsApp before dispatch.",
      icon: "fa-money-bill-wave",
    },
    {
      question: "How can I track my order?",
      answer:
        "Once your order is dispatched, we'll send you a tracking number via WhatsApp and email. You can track your package directly on our website or through the courier's tracking portal. Feel free to contact us anytime for order updates!",
      icon: "fa-location-dot",
    },
    {
      question: "Are the product prices competitive?",
      answer:
        "We offer competitive market prices without compromising on authenticity. Plus, we frequently run promotions, bundle deals, and seasonal sales. Follow us on social media for exclusive discounts and flash sales!",
      icon: "fa-tags",
    },
    {
      question: "Can I get personalized beauty advice?",
      answer:
        "Of course! Our beauty experts are available on WhatsApp to help you with product recommendations, skincare routines, and makeup tips. We're committed to helping you achieve your beauty goals with the right products and guidance.",
      icon: "fa-comment-dots",
    },
  ];

  if (!mounted) {
    return null;
  }

  return (
    <section id="faq" className="faq-section">
      <div className="container">
        <div className="section-header centered" data-aos="fade-up">
          <span className="section-label">Got Questions?</span>
          <h2 className="section-title">Frequently Asked Questions</h2>
          <p className="section-subtitle">
            Everything you need to know about our products and services
          </p>
        </div>

        <div className="faq-accordion" data-aos="fade-up" data-aos-delay="100">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`faq-item ${activeIndex === index ? "active" : ""}`}
              data-aos="fade-up"
              data-aos-delay={150 + index * 50}
            >
              <button
                className="faq-question"
                onClick={() => toggleFAQ(index)}
                aria-expanded={activeIndex === index}
                aria-controls={`faq-answer-${index}`}
              >
                <span className="faq-icon-wrapper">
                  <i className={`fas ${faq.icon}`} aria-hidden="true"></i>
                </span>
                <span className="faq-question-text">{faq.question}</span>
                <span className="faq-arrow">
                  <i
                    className={`fas fa-chevron-down ${activeIndex === index ? "rotated" : ""}`}
                    aria-hidden="true"
                  ></i>
                </span>
              </button>
              <div
                id={`faq-answer-${index}`}
                className="faq-answer-wrapper"
                ref={(el) => (contentRefs.current[index] = el)}
                style={{
                  maxHeight:
                    activeIndex === index
                      ? `${contentRefs.current[index]?.scrollHeight || 500}px`
                      : "0px",
                }}
              >
                <div className="faq-answer-content">
                  <p>{faq.answer}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="faq-cta" data-aos="fade-up" data-aos-delay="300">
          <div className="faq-cta-content">
            <i className="fas fa-comments" aria-hidden="true"></i>
            <div>
              <h4>Still have questions?</h4>
              <p>
                We're here to help! Contact us on WhatsApp for instant support
                and personalized recommendations.
              </p>
            </div>
            <a
              href="https://wa.me/923436606652"
              target="_blank"
              rel="noopener noreferrer"
              className="faq-cta-btn"
              aria-label="Chat on WhatsApp"
            >
              <i className="fab fa-whatsapp" aria-hidden="true"></i>
              Chat With Us
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
