"use client";
import { useState, useRef, useEffect, useCallback } from "react";

export default function WhatsAppButton() {
  const phoneNumber = process.env.NEXT_PUBLIC_PHONE || "+923001234567";
  const cleanPhone = phoneNumber.replace(/[\s\+\-\(\)]/g, "");
  const message = "Hi! I have a question about your products.";

  const buttonRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [hasMoved, setHasMoved] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const startPos = useRef({ x: 0, y: 0 });
  const longPressTimer = useRef(null);
  const isLongPress = useRef(false);
  const mounted = useRef(false);

  // Set initial position on mount
  useEffect(() => {
    mounted.current = true;

    // Load saved position or use default
    const saved = localStorage.getItem("whatsapp-btn-position");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setPosition(parsed);
        return;
      } catch (e) {
        // Use default
      }
    }

    // Default: bottom-right
    setPosition({
      x: window.innerWidth - 80,
      y: window.innerHeight - 80,
    });
  }, []);

  // Save position
  const savePosition = useCallback((pos) => {
    try {
      localStorage.setItem("whatsapp-btn-position", JSON.stringify(pos));
    } catch (e) {
      // Ignore
    }
  }, []);

  // Start dragging (mouse)
  const handleMouseDown = (e) => {
    e.preventDefault();
    isLongPress.current = false;

    // Start long press timer
    longPressTimer.current = setTimeout(() => {
      isLongPress.current = true;
      startDrag(e.clientX, e.clientY);
    }, 200);
  };

  // Start dragging (touch)
  const handleTouchStart = (e) => {
    isLongPress.current = false;

    longPressTimer.current = setTimeout(() => {
      isLongPress.current = true;
      const touch = e.touches[0];
      startDrag(touch.clientX, touch.clientY);
    }, 300);
  };

  const startDrag = (clientX, clientY) => {
    setIsDragging(true);
    setHasMoved(false);
    dragStart.current = { x: clientX, y: clientY };
    startPos.current = { ...position };

    // Add grabbing cursor to body
    document.body.style.cursor = "grabbing";
    document.body.style.userSelect = "none";
  };

  // Move
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging) return;

      const dx = e.clientX - dragStart.current.x;
      const dy = e.clientY - dragStart.current.y;

      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
        setHasMoved(true);
      }

      const newX = Math.max(
        20,
        Math.min(window.innerWidth - 70, startPos.current.x + dx),
      );
      const newY = Math.max(
        20,
        Math.min(window.innerHeight - 70, startPos.current.y + dy),
      );

      setPosition({ x: newX, y: newY });
    };

    const handleTouchMove = (e) => {
      if (!isDragging) return;
      e.preventDefault();

      const touch = e.touches[0];
      const dx = touch.clientX - dragStart.current.x;
      const dy = touch.clientY - dragStart.current.y;

      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
        setHasMoved(true);
      }

      const newX = Math.max(
        20,
        Math.min(window.innerWidth - 70, startPos.current.x + dx),
      );
      const newY = Math.max(
        20,
        Math.min(window.innerHeight - 70, startPos.current.y + dy),
      );

      setPosition({ x: newX, y: newY });
    };

    const stopDrag = () => {
      clearTimeout(longPressTimer.current);

      if (isDragging) {
        setIsDragging(false);
        document.body.style.cursor = "";
        document.body.style.userSelect = "";

        // Save position
        if (mounted.current) {
          savePosition(position);
        }
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", stopDrag);
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", stopDrag);
    window.addEventListener("touchcancel", stopDrag);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", stopDrag);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", stopDrag);
      window.removeEventListener("touchcancel", stopDrag);
    };
  }, [isDragging, position, savePosition]);

  // Handle click (only if not dragged)
  const handleClick = (e) => {
    if (hasMoved) {
      e.preventDefault();
      return;
    }
    // Normal click - opens WhatsApp
  };

  // Snap to edges on release
  const handleMouseUp = () => {
    if (position.x > window.innerWidth / 2) {
      // Snap right
      setPosition((prev) => ({ ...prev, x: window.innerWidth - 80 }));
    } else {
      // Snap left
      setPosition((prev) => ({ ...prev, x: 20 }));
    }
  };

  return (
    <a
      ref={buttonRef}
      href={
        hasMoved
          ? "#"
          : `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`
      }
      className={`whatsapp-fab ${isDragging ? "dragging" : ""}`}
      target={hasMoved ? "_self" : "_blank"}
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        right: "auto",
        bottom: "auto",
        transition: isDragging ? "none" : "left 0.3s ease, top 0.3s ease",
      }}
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      onMouseUp={handleMouseUp}
    >
      <i className="fab fa-whatsapp"></i>

      {/* Drag hint */}
      <span className="whatsapp-drag-hint">
        <i className="fas fa-grip-dots"></i>
      </span>
    </a>
  );
}
