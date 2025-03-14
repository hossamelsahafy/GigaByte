import admin from "firebase-admin";
import { getStorage } from "firebase-admin/storage";
import fs from "fs";

// Read Firebase credentials from file
const serviceAccount = JSON.parse(
  fs.readFileSync(process.env.FIREBASE_ADMIN_SDK_KEY, "utf8")
);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  });
}

const bucket = getStorage().bucket();

const Media = {
  slug: "media",
  upload: {
    staticURL: "/media",
    staticDir: "media",
    handler: async ({ data, file }) => {
      const uploadPath = `uploads/${file.filename}`;
      const fileUpload = bucket.file(uploadPath);

      await fileUpload.save(file.buffer, {
        metadata: { contentType: file.mimetype },
      });

      return {
        url: `https://storage.googleapis.com/${process.env.FIREBASE_STORAGE_BUCKET}/${uploadPath}`,
      };
    },
  },
  fields: [],
};

export default Media;
