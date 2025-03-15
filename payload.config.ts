import { buildConfig } from "payload";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { mongooseAdapter } from "@payloadcms/db-mongodb";
import { s3Storage } from "@payloadcms/storage-s3";
import Users from "./src/app/(payload)/_collection/User.js";
import Products from "./src/app/(payload)/_collection/Products.js";
import Categories from "./src/app/(payload)/_collection/categories.js";
import Orders from "./src/app/(payload)/_collection/orders.js";
import Media from "./src/app/(payload)/_collection/Media.js";
export default buildConfig({
  editor: lexicalEditor(),
  collections: [Users, Products, Categories, Orders, Media],
  secret: process.env.PAYLOAD_SECRET || process.env.NEXTAUTH_SECRET || "",
  db: mongooseAdapter({
    url: process.env.MONGODB_URI || "",
  }),
  admin: {
    user: "users",
  },
  plugins: [
    s3Storage({
      collections: {
        media: {
          prefix: "media",
        },
      },
      bucket: process.env.S3_BUCKET,
      config: {
        forcePathStyle: true,
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY_ID,
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
        },
        region: process.env.S3_REGION,
        endpoint: process.env.S3_ENDPOINT,
      },
    }),
  ],
});
