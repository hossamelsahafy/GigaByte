import { NextResponse } from "next/server";
import cloudinary from "cloudinary";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { writeFile } from "fs/promises";
import mongoose from "mongoose";
import fetch from "node-fetch"; // Ensure this is imported

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function connectDB() {
  if (!mongoose.connection.readyState) {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }
  return mongoose.connection.db;
}

export async function POST(req) {
  let tempFilePath;
  let session;

  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const tempDir = path.join(__dirname, "temp");
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    tempFilePath = path.join(tempDir, `${Date.now()}-${file.name}`);
    await writeFile(tempFilePath, buffer);

    console.log("📤 Uploading file to Cloudinary...");

    // Upload to Cloudinary
    const result = await cloudinary.v2.uploader.upload(tempFilePath, {
      folder: "payload_media",
    });

    console.log("✅ Cloudinary Upload Success:", result.secure_url);

    const thumbnailURL = result.secure_url.replace("/upload/", "/upload/w_200,h_200,c_fill/");

    // Save to MongoDB
    const db = await connectDB();
    session = await mongoose.startSession();
    session.startTransaction();

    const newMedia = {
      cloudinaryUrl: result.secure_url,
      publicId: result.public_id,
      filename: file.name,
      thumbnailURL,
      createdAt: new Date(),
    };

    await db.collection("media").insertOne(newMedia, { session });

    await session.commitTransaction();
    session.endSession();

    console.log("✅ Upload Success:", newMedia);

    // 🔥 **Insert media into Payload CMS via API**
    const payloadResponse = await fetch(`${process.env.PAYLOAD_CMS_HOST}/api/media`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.PAYLOAD_API_KEY}`, // Ensure this is set
      },
      body: JSON.stringify({
        filename: file.name,
        cloudinaryUrl: result.secure_url,
        thumbnailURL,
        publicId: result.public_id,
      }),
    });

    const payloadData = await payloadResponse.json();
    if (!payloadResponse.ok) {
      throw new Error(`Payload CMS Error: ${payloadData.message || "Failed to insert media"}`);
    }

    console.log("✅ Media inserted into Payload CMS:", payloadData);

    return NextResponse.json({ success: true, media: newMedia, payloadCMS: payloadData });
  } catch (error) {
    if (session) {
      await session.abortTransaction();
      session.endSession();
    }
    console.error("❌ Upload Error:", error);
    return NextResponse.json({ error: "Upload failed", details: error.message }, { status: 500 });
  } finally {
    if (tempFilePath && fs.existsSync(tempFilePath)) {
      fs.unlinkSync(tempFilePath);
    }
  }
}
