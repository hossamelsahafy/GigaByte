import { MongoClient } from "mongodb";
import fs from "fs";

const uri = process.env.MONGODB_URI;
let clientPromise = null;

async function getDb() {
  if (!clientPromise) {
    clientPromise = MongoClient.connect(uri);
  }
  return (await clientPromise).db();
}

const createMediaDocument = async (cloudinaryUrl, publicId, localFilePath) => {
  try {
    const db = await getDb();
    
    // Insert new media document
    const insertResult = await db.collection("media").insertOne({
      cloudinaryUrl,
      publicId,
      originalFilename: localFilePath,
      uploadedAt: new Date()
    });

    console.log("✅ Created new media document ID:", insertResult.insertedId);

    // Delete local file after successful upload
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
      console.log("🗑️ Deleted local file:", localFilePath);
    }

    return insertResult;

  } catch (error) {
    console.error("❌ MongoDB Insert Error:", error);
    throw error;
  }
};

export default createMediaDocument;