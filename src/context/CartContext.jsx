"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";

const CartContext = createContext(null);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    return {
      cartItems: [],
      addToCart: () => {},
      removeFromCart: () => {},
      updateQuantity: () => {},
      clearCart: () => {},
      getCartTotal: () => 0,
      getCartCount: () => 0,
      isOpen: false,
      openCart: () => {},
      closeCart: () => {},
    };
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem("wecozmo_cart");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setCartItems(parsed);
        }
      }
    } catch (error) {
      console.error("Failed to load cart:", error);
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      try {
        localStorage.setItem("wecozmo_cart", JSON.stringify(cartItems));
      } catch (error) {
        console.error("Failed to save cart:", error);
      }
    }
  }, [cartItems, mounted]);

  const triggerCelebration = useCallback(() => {
    // Screen shake
    document.body.classList.add("cart-shake");
    setTimeout(() => document.body.classList.remove("cart-shake"), 400);

    if (typeof window !== "undefined" && window.cartCelebrate) {
      const x = window.innerWidth / 2;
      const y = window.innerHeight / 2;
      window.cartCelebrate(x, y);
    }
  }, []);

  const addToCart = useCallback(
    (product, quantity = 1) => {
      setCartItems((prev) => {
        const existing = prev.find((item) => item.id === product.id);
        if (existing) {
          return prev.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item,
          );
        }
        return [...prev, { ...product, quantity }];
      });

      // 🎉 Trigger celebration
      triggerCelebration();

      setIsOpen(true);
    },
    [triggerCelebration],
  );

  const removeFromCart = useCallback((id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const updateQuantity = useCallback((id, newQty) => {
    if (newQty <= 0) {
      setCartItems((prev) => prev.filter((item) => item.id !== id));
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: newQty } : item,
      ),
    );
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
    if (typeof window !== "undefined") {
      localStorage.removeItem("wecozmo_cart");
    }
  }, []);

  const getCartTotal = useCallback(() => {
    if (!cartItems || cartItems.length === 0) return 0;
    return cartItems.reduce(
      (total, item) => total + (item.price || 0) * (item.quantity || 0),
      0,
    );
  }, [cartItems]);

  const getCartCount = useCallback(() => {
    if (!cartItems || cartItems.length === 0) return 0;
    return cartItems.reduce((count, item) => count + (item.quantity || 0), 0);
  }, [cartItems]);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartCount,
        isOpen,
        openCart,
        closeCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
