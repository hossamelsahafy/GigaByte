import { buildConfig } from "payload";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { mongooseAdapter } from "@payloadcms/db-mongodb";
import Users from "./src/app/(payload)/_collection/User.js";
import Products from "./src/app/(payload)/_collection/Products.js";
import Categories from "./src/app/(payload)/_collection/categories.js";
import Orders from "./src/app/(payload)/_collection/orders.js";
import Media from "./src/app/(payload)/_collection/Media.js"; // Ensure this is updated for Cloudinary
export default buildConfig({
  editor: lexicalEditor(),
  collections: [Users, Products, Categories, Orders, Media], // Ensure Media is set up for Cloudinary
  secret: process.env.PAYLOAD_SECRET || process.env.NEXTAUTH_SECRET || "",
  db: mongooseAdapter({
    url: process.env.MONGODB_URI || "",
  }),
  admin: {
    user: "users",
  },
});
