import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, getDocs, addDoc } from "firebase/firestore";

export async function GET() {
  try {
    const viewsSnap = await getDocs(collection(db, "product_views"));
    const views = viewsSnap.docs.map((d) => d.data());

    const cartSnap = await getDocs(collection(db, "cart_events"));
    const cartEvents = cartSnap.docs.map((d) => d.data());

    const searchSnap = await getDocs(collection(db, "searches"));
    const searches = searchSnap.docs.map((d) => d.data());

    const orderSnap = await getDocs(collection(db, "orders"));
    const orders = orderSnap.docs.map((d) => ({ id: d.id, ...d.data() }));

    const viewCounts = {};
    views.forEach((v) => {
      viewCounts[v.productId] = (viewCounts[v.productId] || 0) + 1;
    });

    const cartCounts = {};
    cartEvents.forEach((c) => {
      if (c.action === "add") {
        cartCounts[c.productId] = (cartCounts[c.productId] || 0) + 1;
      }
    });

    const searchCounts = {};
    searches.forEach((s) => {
      searchCounts[s.searchTerm] = (searchCounts[s.searchTerm] || 0) + 1;
    });

    const topSearches = Object.entries(searchCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([term, count]) => ({ term, count }));

    const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);

    const mostViewed = Object.entries(viewCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([id, count]) => ({ productId: id, views: count }));

    return NextResponse.json({
      totalViews: views.length,
      totalAddToCart: cartEvents.filter((c) => c.action === "add").length,
      totalRemovedFromCart: cartEvents.filter((c) => c.action === "remove")
        .length,
      totalSearches: searches.length,
      totalOrders: orders.length,
      totalRevenue,
      topSearches,
      mostViewed,
      viewCounts,
      cartCounts,
      recentOrders: orders.slice(-10).reverse(),
    });
  } catch (error) {
    console.error("Analytics API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ✅ ADD THIS POST HANDLER
export async function POST(request) {
  try {
    const { event, ...data } = await request.json();

    if (event === "product_view") {
      await addDoc(collection(db, "product_views"), {
        ...data,
        timestamp: new Date().toISOString(),
        date: new Date().toISOString().split("T")[0],
      });
    } else if (event === "add_to_cart" || event === "remove_from_cart") {
      await addDoc(collection(db, "cart_events"), {
        ...data,
        action: event === "add_to_cart" ? "add" : "remove",
        timestamp: new Date().toISOString(),
      });
    } else if (event === "search") {
      await addDoc(collection(db, "searches"), {
        ...data,
        timestamp: new Date().toISOString(),
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Analytics POST Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
