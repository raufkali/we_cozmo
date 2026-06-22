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
      const docSnap = await getDoc(doc(db, "categories", id));
      if (!docSnap.exists()) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
      }
      return NextResponse.json({ id: docSnap.id, ...docSnap.data() });
    }

    const snapshot = await getDocs(collection(db, "categories"));
    const categories = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return NextResponse.json(categories);
  } catch (error) {
    console.error("Categories API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const docRef = await addDoc(collection(db, "categories"), {
      name: data.name,
      image: data.image,
      createdAt: new Date().toISOString(),
    });
    return NextResponse.json({ id: docRef.id, success: true });
  } catch (error) {
    console.error("Categories API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const { id, ...data } = await request.json();
    await updateDoc(doc(db, "categories", id), data);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Categories API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { id } = await request.json();
    await deleteDoc(doc(db, "categories", id));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Categories API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
