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

    // Format order items for email
    const itemsList = cartItems
      .map(
        (item, index) =>
          `${index + 1}. ${item.name} x${item.quantity} - Rs. ${((item.price || 0) * (item.quantity || 1)).toFixed(2)}`,
      )
      .join("\n");

    // Get config from environment variables
    const SERVICE_ID = process.env.EMAILJS_SERVICE_ID;
    const TEMPLATE_ID = process.env.EMAILJS_TEMPLATE_ID;
    const PUBLIC_KEY = process.env.EMAILJS_PUBLIC_KEY;
    const PRIVATE_KEY = process.env.EMAILJS_PRIVATE_KEY;
    const SELLER_EMAIL = process.env.NEXT_PUBLIC_EMAIL;

    console.log("📤 Sending order email to seller...");

    const emailData = {
      service_id: SERVICE_ID,
      template_id: TEMPLATE_ID,
      user_id: PUBLIC_KEY,
      accessToken: PRIVATE_KEY,
      template_params: {
        email: SELLER_EMAIL,
        subject: `New Order from ${customerInfo.fullName} - Rs. ${total.toFixed(2)}`,
        customer_name: customerInfo.fullName || "N/A",
        customer_phone: customerInfo.phone || "N/A",
        customer_email: customerInfo.email || "N/A",
        customer_city: customerInfo.city || "N/A",
        customer_address: customerInfo.address || "N/A",
        customer_notes: customerInfo.notes || "None",
        order_items: itemsList || "No items",
        order_total: `Rs. ${(total || 0).toFixed(2)}`,
      },
    };

    const response = await fetch(
      "https://api.emailjs.com/api/v1.0/email/send",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(emailData),
      },
    );

    if (response.ok) {
      console.log("✅ Order email sent successfully!");

      // Send confirmation to customer
      if (customerInfo.email && customerInfo.email !== "N/A") {
        console.log("📤 Sending confirmation to:", customerInfo.email);

        await fetch("https://api.emailjs.com/api/v1.0/email/send", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            service_id: SERVICE_ID,
            template_id: TEMPLATE_ID,
            user_id: PUBLIC_KEY,
            accessToken: PRIVATE_KEY,
            template_params: {
              email: customerInfo.email,
              subject: "Order Confirmed - WeCozmo",
              customer_name: customerInfo.fullName,
              customer_phone: customerInfo.phone,
              customer_email: customerInfo.email,
              customer_city: customerInfo.city,
              customer_address: customerInfo.address,
              customer_notes: "Thank you! We'll contact you shortly.",
              order_items: itemsList,
              order_total: `Rs. ${(total || 0).toFixed(2)}`,
            },
          }),
        });
        console.log("✅ Confirmation sent!");
      }

      return NextResponse.json({ success: true, message: "Order sent!" });
    } else {
      const errorText = await response.text();
      console.error("❌ EmailJS Error:", errorText);
      return NextResponse.json(
        { success: false, message: errorText },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error("❌ Server Error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
}