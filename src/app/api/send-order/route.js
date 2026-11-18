import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";

export async function POST(request) {
  console.log("📦 Order API Hit!");

  try {
    const body = await request.json();
    const { customerInfo, cartItems, total } = body;

    console.log("📦 Order received:", {
      customer: customerInfo?.fullName,
      phone: customerInfo?.phone,
      items: cartItems?.length,
      total: total,
    });

    // ✅ SAVE ORDER TO FIREBASE FOR ANALYTICS AND ADMIN PANEL
    let orderId = null;
    try {
      const orderRef = await addDoc(collection(db, "orders"), {
        customer: {
          name: customerInfo?.fullName || "N/A",
          phone: customerInfo?.phone || "N/A",
          email: customerInfo?.email || "N/A",
          city: customerInfo?.city || "N/A",
          address: customerInfo?.address || "N/A",
          notes: customerInfo?.notes || "None",
        },
        items: (cartItems || []).map((item) => ({
          productId: item.id || "",
          name: item.name,
          price: item.price || 0,
          quantity: item.quantity || 1,
          total: (item.price || 0) * (item.quantity || 1),
        })),
        total: total || 0,
        itemsCount: (cartItems || []).length,
        status: "pending",
        timestamp: new Date().toISOString(),
        date: new Date().toISOString().split("T")[0],
      });
      orderId = orderRef.id;
      console.log("✅ Order saved to Firebase:", orderId);
    } catch (firebaseError) {
      console.error("❌ Firebase save failed:", firebaseError);
      // Continue even if Firebase fails — don't block the order
    }

    // ✅ TRACK PRODUCT PURCHASES FOR ANALYTICS
    try {
      for (const item of cartItems || []) {
        await addDoc(collection(db, "order_items"), {
          orderId: orderId || "order_" + Date.now(),
          productId: item.id || "",
          productName: item.name,
          price: item.price || 0,
          quantity: item.quantity || 1,
          total: (item.price || 0) * (item.quantity || 1),
          timestamp: new Date().toISOString(),
          date: new Date().toISOString().split("T")[0],
        });
      }
      console.log("✅ Order items tracked for analytics");
    } catch (trackError) {
      console.error("❌ Item tracking failed:", trackError);
      // Continue even if tracking fails
    }

    return NextResponse.json({
      success: true,
      orderId: orderId,
      message: "Order placed successfully!",
    });
  } catch (error) {
    console.error("❌ Server Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Internal server error",
      },
      { status: 500 },
    );
  }
}
