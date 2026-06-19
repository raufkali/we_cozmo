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
      if (stored) setCartItems(JSON.parse(stored));
    } catch {}
  }, []);

  useEffect(() => {
    if (mounted)
      localStorage.setItem("wecozmo_cart", JSON.stringify(cartItems));
  }, [cartItems, mounted]);

  const addToCart = useCallback((product, quantity = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing)
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        );
      return [...prev, { ...product, quantity }];
    });
    setIsOpen(true);
  }, []);

  const removeFromCart = useCallback(
    (id) => setCartItems((prev) => prev.filter((item) => item.id !== id)),
    [],
  );
  const updateQuantity = useCallback(
    (id, qty) => {
      if (qty <= 0) {
        removeFromCart(id);
        return;
      }
      setCartItems((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, quantity: qty } : item,
        ),
      );
    },
    [removeFromCart],
  );

  const getCartTotal = useCallback(
    () => cartItems.reduce((t, i) => t + i.price * i.quantity, 0),
    [cartItems],
  );
  const getCartCount = useCallback(
    () => cartItems.reduce((c, i) => c + i.quantity, 0),
    [cartItems],
  );
  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  if (!mounted) return <>{children}</>;

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
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
