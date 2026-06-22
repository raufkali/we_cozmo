import { db } from "./firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";

// Track product view
export async function trackProductView(productId, productName, price) {
  await addDoc(collection(db, "product_views"), {
    productId,
    productName,
    price,
    timestamp: new Date().toISOString(),
    date: new Date().toISOString().split("T")[0],
  });
}

// Track add to cart
export async function trackAddToCart(
  productId,
  productName,
  price,
  quantity = 1,
) {
  await addDoc(collection(db, "cart_events"), {
    productId,
    productName,
    price,
    quantity,
    action: "add",
    timestamp: new Date().toISOString(),
  });
}

// Track remove from cart
export async function trackRemoveFromCart(productId, productName, price) {
  await addDoc(collection(db, "cart_events"), {
    productId,
    productName,
    price,
    action: "remove",
    timestamp: new Date().toISOString(),
  });
}

// Track search
export async function trackSearch(searchTerm, resultsCount) {
  await addDoc(collection(db, "searches"), {
    searchTerm,
    resultsCount,
    timestamp: new Date().toISOString(),
  });
}

// Track order placed
export async function trackOrder(orderData) {
  await addDoc(collection(db, "orders"), {
    ...orderData,
    status: "pending",
    timestamp: new Date().toISOString(),
    date: new Date().toISOString().split("T")[0],
  });
}
