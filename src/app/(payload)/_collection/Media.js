import path from "path";
import fs from "fs";
import fetch from "node-fetch";
import FormData from "form-data";
import mongoose from "mongoose";

const Media = {
  slug: "media",
  fields: [
    { name: "cloudinaryUrl", type: "text", label: "Cloudinary URL", admin: { readOnly: true } },
    { name: "publicId", type: "text", label: "Cloudinary Public ID", admin: { readOnly: true } },
    { name: "thumbnailURL", type: "text", label: "Thumbnail URL", admin: { readOnly: true } },
  ],
  hooks: {
    afterChange: [
      async ({ doc }) => {
        if (!doc.filename || doc.cloudinaryUrl) return doc;
        
        try {
          const filePath = path.join(process.cwd(), "uploads/media", doc.filename);
          if (!fs.existsSync(filePath)) return doc;
          
          console.log("🚀 Uploading to Cloudinary...");
          
          const formData = new FormData();
          formData.append("file", fs.createReadStream(filePath));
          
          const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/upload`, {
            method: "POST",
            body: formData,
            headers: formData.getHeaders(),
          });

          if (!response.ok) {
            throw new Error(`Upload failed: ${response.status} ${response.statusText}`);
          }

          const text = await response.text();
          if (!text) {
            throw new Error("Empty response from Cloudinary upload API");
          }

          const data = JSON.parse(text);
          console.log("✅ Cloudinary Upload Success:", data.media);

          if (!data.media || !data.media.cloudinaryUrl) {
            throw new Error("Invalid response from Cloudinary API");
          }

          // Update MongoDB with Cloudinary details
          const updatedDoc = await mongoose.connection.db.collection("media").findOneAndUpdate(
            { _id: doc._id },
            { 
              $set: { 
                cloudinaryUrl: data.media.cloudinaryUrl, 
                publicId: data.media.publicId, 
                thumbnailURL: data.media.thumbnailURL 
              } 
            },
            { returnDocument: "after" }
          );

          console.log("📝 Updated Document in MongoDB:", updatedDoc.value);
          return updatedDoc.value;

        } catch (error) {
          console.error("❌ Upload Error:", error);
          return doc;
        }
      },
    ],
  },
  upload: {
    staticURL: "/media",
    staticDir: "uploads/media",
    mimeTypes: ["image/*"],
    adminThumbnail: ({ doc }) => doc.thumbnailURL || doc.cloudinaryUrl || "/default-thumbnail.jpg"
  },
};

export default Media;
