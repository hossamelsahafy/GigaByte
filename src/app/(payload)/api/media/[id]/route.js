import { NextResponse } from "next/server";
import clientPromise from "../../../lib/dbConnect.js";

export async function PUT(req, context) {
  try {
    const { id } = context.params;

    if (!id) {
      return NextResponse.json({ error: "Missing imageId" }, { status: 400 });
    }

    const { cloudinaryUrl, publicId } = await req.json();

    const client = await clientPromise;
    const db = client.db();
    const mediaCollection = db.collection("media");

    // Check if document exists using imageId
    const existingDoc = await mediaCollection.findOne({ imageId: id });
    if (!existingDoc) {
      return NextResponse.json(
        { error: "Document not found" },
        { status: 404 }
      );
    }

    // Update document
    const result = await mediaCollection.updateOne(
      { imageId: id },
      { $set: { cloudinaryUrl, publicId } }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json({ error: "No changes made" }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PUT /media/:id error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
