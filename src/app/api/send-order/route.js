import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";

export async function POST(request) {
  console.log("📧 Order API Hit!");

  try {
    const body = await request.json();
    const { customerInfo, cartItems, total } = body;

    console.log("📦 Order received:", {
      customer: customerInfo.fullName,
      phone: customerInfo.phone,
      items: cartItems.length,
      total: total,
    });

    // ✅ SAVE ORDER TO FIREBASE FOR ANALYTICS
    try {
      const orderRef = await addDoc(collection(db, "orders"), {
        customer: {
          name: customerInfo.fullName || "N/A",
          phone: customerInfo.phone || "N/A",
          email: customerInfo.email || "N/A",
          city: customerInfo.city || "N/A",
          address: customerInfo.address || "N/A",
          notes: customerInfo.notes || "None",
        },
        items: cartItems.map((item) => ({
          productId: item.id || "",
          name: item.name,
          price: item.price || 0,
          quantity: item.quantity || 1,
          total: (item.price || 0) * (item.quantity || 1),
        })),
        total: total || 0,
        itemsCount: cartItems.length,
        status: "pending",
        timestamp: new Date().toISOString(),
        date: new Date().toISOString().split("T")[0],
      });
      console.log("✅ Order saved to Firebase:", orderRef.id);
    } catch (firebaseError) {
      console.error("❌ Firebase save failed:", firebaseError);
      // Continue even if Firebase fails — don't block the order
    }

    // ✅ TRACK PRODUCT PURCHASES FOR ANALYTICS
    try {
      for (const item of cartItems) {
        await addDoc(collection(db, "order_items"), {
          orderId: "order_" + Date.now(),
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

    // 📧 FORMAT ORDER ITEMS FOR EMAIL
    const itemsList = cartItems
      .map(
        (item, index) =>
          `${index + 1}. ${item.name} x${item.quantity} - Rs. ${((item.price || 0) * (item.quantity || 1)).toFixed(2)}`,
      )
      .join("\n");

    // 📧 GET EMAILJS CONFIG
    const SERVICE_ID = process.env.EMAILJS_SERVICE_ID;
    const TEMPLATE_ID = process.env.EMAILJS_TEMPLATE_ID;
    const PUBLIC_KEY = process.env.EMAILJS_PUBLIC_KEY;
    const PRIVATE_KEY = process.env.EMAILJS_PRIVATE_KEY;
    const SELLER_EMAIL = process.env.NEXT_PUBLIC_EMAIL;

    // ✅ VALIDATE EMAILJS CONFIG
    if (
      !SERVICE_ID ||
      !TEMPLATE_ID ||
      !PUBLIC_KEY ||
      !PRIVATE_KEY ||
      !SELLER_EMAIL
    ) {
      console.error("❌ Missing EmailJS configuration!");
      return NextResponse.json(
        {
          success: false,
          message: "Email service not configured properly",
        },
        { status: 500 },
      );
    }

    console.log("📤 Sending order email to seller...");

    // 📧 SEND EMAIL TO SELLER ONLY
    const emailData = {
      service_id: SERVICE_ID,
      template_id: TEMPLATE_ID,
      user_id: PUBLIC_KEY,
      accessToken: PRIVATE_KEY,
      template_params: {
        // Recipient
        email: SELLER_EMAIL,

        // Customer Information
        customer_name: customerInfo.fullName || "N/A",
        customer_phone: customerInfo.phone || "N/A",
        customer_email: customerInfo.email || "N/A",
        customer_city: customerInfo.city || "N/A",
        customer_address: customerInfo.address || "N/A",
        customer_notes: customerInfo.notes || "None",

        // Order Details
        order_items: itemsList || "No items",
        order_total: `Rs. ${(total || 0).toFixed(2)}`,
      },
    };

    // Log email data for debugging (remove in production)
    console.log("📧 Email Data:", {
      service_id: SERVICE_ID,
      template_id: TEMPLATE_ID,
      to: SELLER_EMAIL,
      customer: customerInfo.fullName,
      total: total,
    });

    const response = await fetch(
      "https://api.emailjs.com/api/v1.0/email/send",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(emailData),
      },
    );

    // 📧 HANDLE EMAIL RESPONSE
    if (response.ok) {
      console.log("✅ Order email sent successfully!");

      return NextResponse.json({
        success: true,
        message: "Order placed and email sent!",
      });
    } else {
      const errorText = await response.text();
      console.error("❌ EmailJS Error:", errorText);

      // Try to parse error for better messaging
      let errorMessage = errorText;
      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.error || errorJson.message || errorText;
      } catch (e) {
        // Keep original error text
      }

      return NextResponse.json(
        {
          success: false,
          message: `Email sending failed: ${errorMessage}`,
        },
        { status: 500 },
      );
    }
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
