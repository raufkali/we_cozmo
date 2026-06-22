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
} from "firebase/firestore";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (id) {
      const docSnap = await getDoc(doc(db, "banners", id));
      if (!docSnap.exists()) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
      }
      return NextResponse.json({ id: docSnap.id, ...docSnap.data() });
    }

    const snapshot = await getDocs(collection(db, "banners"));
    const banners = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return NextResponse.json(banners);
  } catch (error) {
    console.error("Banners API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
export async function POST(request) {
  try {
    const data = await request.json();
    const docRef = await addDoc(collection(db, "banners"), {
      image: data.image,
      title: data.title,
      subtitle: data.subtitle || "",
      cta: data.cta || "Shop Now",
      order: data.order || 0,
      active: data.active !== false,
      createdAt: new Date().toISOString(),
    });
    return NextResponse.json({ id: docRef.id, success: true });
  } catch (error) {
    console.error("Banners API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const { id, ...data } = await request.json();
    await updateDoc(doc(db, "banners", id), data);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Banners API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { id } = await request.json();
    await deleteDoc(doc(db, "banners", id));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Banners API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
