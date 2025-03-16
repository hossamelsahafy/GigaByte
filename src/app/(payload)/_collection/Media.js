import path from "path";
import fs from "fs";
import fetch from "node-fetch";
import FormData from "form-data";
import { fileURLToPath } from "url";
import { MongoClient } from "mongodb";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// const Media = {
//   slug: "media",
//   upload: {
//     staticURL: "/media",
//     staticDir: "uploads/media",
//     mimeTypes: ["image/*"],
//     adminThumbnail: ({ doc }) =>
//       doc?.cloudinaryUrl ? doc.cloudinaryUrl : "/default-image.jpg",
//   },
//   fields: [
//     {
//       name: "cloudinaryUrl",
//       type: "text",
//       label: "Cloudinary URL",
//       admin: { readOnly: true },
//     },
//     {
//       name: "publicId",
//       type: "text",
//       label: "Cloudinary Public ID",
//       admin: { readOnly: true },
//     },
//   ],
//   hooks: {
//     afterChange: [
//       async ({ doc, req }) => {
//         if (!doc.filename) return doc;

//         try {
//           const localFilePath = path.join(
//             process.cwd(),
//             "uploads/media",
//             doc.filename
//           );
//           if (!fs.existsSync(localFilePath)) return doc;

//           console.log("🚀 Uploading to Cloudinary...");

//           const formData = new FormData();
//           formData.append("file", fs.createReadStream(localFilePath));

//           const response = await fetch(
//             `${process.env.NEXT_PUBLIC_HOST}/api/upload`,
//             {
//               method: "POST",
//               body: formData,
//               headers: formData.getHeaders(),
//             }
//           );

//           const data = await response.json();
//           if (!response.ok) throw new Error(data.error || "Upload failed");

//           console.log("✅ Cloudinary upload success:", data);

//           // ✅ Update document with Cloudinary details
//           const updatedDoc = await req.payload.update({
//             collection: "media",
//             id: doc.id,
//             data: {
//               cloudinaryUrl: data.url,
//               publicId: data.publicId,
//             },
//           });

//           return updatedDoc;
//         } catch (error) {
//           console.error("❌ Upload Error:", error);
//           return doc;
//         }
//       },
//     ],
//   },
// };

// export default Media;
let clientPromise;

async function getDb() {
  if (!clientPromise) {
    clientPromise = MongoClient.connect(process.env.MONGODB_URI);
  }
  const client = await clientPromise;
  return client.db();
}

const Media = {
  slug: "media",
  upload: {
    staticURL: "/media",
    staticDir: "uploads/media",
    mimeTypes: ["image/*"],
    adminThumbnail: ({ doc }) =>
      doc?.cloudinaryUrl ? doc.cloudinaryUrl : "/tr.png",
  },
  fields: [
    {
      name: "cloudinaryUrl",
      type: "text",
      label: "Cloudinary URL",
      admin: { readOnly: true },
    },
    {
      name: "publicId",
      type: "text",
      label: "Cloudinary Public ID",
      admin: { readOnly: true },
    },
  ],
  hooks: {
    afterChange: [
      async ({ doc, req }) => {
        if (!doc.filename) return doc;

        try {
          const localFilePath = path.join(
            process.cwd(),
            "uploads/media",
            doc.filename
          );
          if (!fs.existsSync(localFilePath)) return doc;

          console.log("🚀 Uploading to Cloudinary...");

          const formData = new FormData();
          formData.append("file", fs.createReadStream(localFilePath));

          const response = await fetch(
            `${process.env.NEXT_PUBLIC_HOST}/api/upload`,
            {
              method: "POST",
              body: formData,
              headers: formData.getHeaders(),
            }
          );

          const data = await response.json();
          // if (!response.ok) throw new Error(data.error || "Upload failed");

          // console.log("✅ Cloudinary upload success:", data);

          // ✅ Update document with Cloudinary details
          try {
            const db = await getDb(); // Use the getDb function for MongoDB connection
            const updatedDoc = await db.collection("media").updateOne(
              { _id: doc.id }, // Use the correct condition to find the document
              {
                $set: {
                  cloudinaryUrl: data.url,
                  publicId: data.publicId,
                },
              }
            );
            return updatedDoc;
          } catch (error) {
            console.error("❌ Upload Error:", error);
            return doc;
          }
        } catch (error) {
          console.error("❌ Upload Error:", error);
          return doc;
        }
      },
    ],
  },
};

export default Media;
