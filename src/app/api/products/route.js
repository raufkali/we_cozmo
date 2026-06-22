import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
  getDoc,
  query,
  where,
} from "firebase/firestore";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const category = searchParams.get("category");

    if (id) {
      const docSnap = await getDoc(doc(db, "products", id));
      if (!docSnap.exists()) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
      }
      return NextResponse.json({ id: docSnap.id, ...docSnap.data() });
    }

    let snapshot;
    if (category && category !== "all") {
      const q = query(
        collection(db, "products"),
        where("category", "==", category),
      );
      snapshot = await getDocs(q);
    } else {
      snapshot = await getDocs(collection(db, "products"));
    }

    const products = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return NextResponse.json(products);
  } catch (error) {
    console.error("Products API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const docRef = await addDoc(collection(db, "products"), {
      name: data.name,
      price: parseFloat(data.price),
      originalPrice: data.originalPrice ? parseFloat(data.originalPrice) : null,
      category: data.category,
      image: data.image,
      description: data.description || "",
      rating: data.rating || 0,
      reviews: data.reviews || 0,
      stock: parseInt(data.stock) || 0,
      inStock: true,
      createdAt: new Date().toISOString(),
    });
    return NextResponse.json({ id: docRef.id, success: true });
  } catch (error) {
    console.error("Products API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const { id, ...data } = await request.json();
    await updateDoc(doc(db, "products", id), {
      name: data.name,
      price: parseFloat(data.price),
      originalPrice: data.originalPrice ? parseFloat(data.originalPrice) : null,
      category: data.category,
      image: data.image,
      description: data.description || "",
      stock: parseInt(data.stock) || 0,
      updatedAt: new Date().toISOString(),
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Products API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { id } = await request.json();
    await deleteDoc(doc(db, "products", id));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Products API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
