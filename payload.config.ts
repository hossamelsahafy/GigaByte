import { buildConfig } from "payload";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { mongooseAdapter } from "@payloadcms/db-mongodb";
import Users from "./src/app/(payload)/_collection/User.js";
import Products from "./src/app/(payload)/_collection/Products.js";
import Categories from "./src/app/(payload)/_collection/categories.js";
import Comments from "./src/app/(payload)/_collection/Comments.js";
import Orders from "./src/app/(payload)/_collection/orders.js";
import Media from "./src/app/(payload)/_collection/Media.js";

export default buildConfig({
  editor: lexicalEditor(),
  collections: [Users, Products, Media, Categories, Comments, Orders],
  secret: process.env.PAYLOAD_SECRET || process.env.NEXTAUTH_SECRET || "",
  db: mongooseAdapter({
    url: process.env.MONGODB_URI,
  }),
  admin: {
    user: "users",
  },
  // Override Payload's auth with NextAuth
  hooks: {
    beforeOperation: [
      async ({ args, operation }) => {
        if (
          operation === "read" ||
          operation === "update" ||
          operation === "delete"
        ) {
          const { req } = args;
          const { getSession } = await import("next-auth/react");
          const session = await getSession({ req });
          console.log("NextAuth session in hook:", session);
          if (session) {
            req.user = session.user; // Inject NextAuth user into req
          }
        }
        return args;
      },
    ],
  },
});
