// src/app/(payload)/_collection/categories.js

import { relationship } from "node_modules/payload/dist/fields/validations.js";

/** @type {import('payload/types').CollectionConfig} */
const Categories = {
  slug: "categories",
  admin: {
    useAsTitle: "name",
  },
  access: {
    read: () => true,
    create: ({ req }) => req.user?.role === "admin",
    update: ({ req }) => req.user?.role === "admin",
    delete: ({ req }) => req.user?.role === "admin",
  },
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
          console.log("NextAuth session in hook (Categories):", session);
          if (session) {
            req.user = session.user;
          }
        }
        return args;
      },
    ],
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
      label: "Category Name",
    },
    {
      name: "image",
      type: "relationship", // Changed to 'relationship' type
      relationTo: "media", // Points to the 'media' collection
      required: true,
      label: "Category Image",
    },
    {
      name: "products",
      type: "relationship",
      relationTo: "products",
      hasMany: true,
      label: "Products in this Category",
    },
  ],
};

export default Categories;
