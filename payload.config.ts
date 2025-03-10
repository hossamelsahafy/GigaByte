import { buildConfig } from "payload";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import Users from "./src/app/(payload)/_collection/User.js";
import Products from "./src/app/(payload)/_collection/Products.js";
import Categories from "./src/app/(payload)/_collection/categories.js";
import Comments from "./src/app/(payload)/_collection/Comments.js";
import Orders from "./src/app/(payload)/_collection/orders.js";
import Media from "./src/app/(payload)/_collection/Media.js";

export default buildConfig({
  editor: lexicalEditor(),
  collections: [Users, Products, Media, Categories, Comments, Orders],
  secret: process.env.PAYLOAD_SECRET || "",
});
