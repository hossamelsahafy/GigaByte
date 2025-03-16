/** @type {import('payload/types').CollectionConfig} */
const Products = {
  slug: "products",
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
          console.log("NextAuth session in hook (Products):", session);
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
      label: "Product Name",
    },
    {
      name: "description",
      type: "textarea",
      required: true,
      label: "Product Description",
    },
    {
      name: "price",
      type: "number",
      required: true,
      label: "Price",
      min: 0,
    },
    {
      name: "images",
      type: "array",
      label: "Product Images",
      fields: [
        {
          name: "image",
          type: "relationship",
          relationTo: "media", // Link to the media collection
          required: true,
          label: "Image",
          hasMany: true, // Allows multiple images
        },
      ],
    },

    {
      name: "category",
      type: "relationship",
      relationTo: "categories",
      label: "Category",
    },
    {
      name: "stock",
      type: "number",
      required: true,
      label: "Stock Quantity",
      min: 0,
    },
    {
      name: "isFeatured",
      type: "checkbox",
      label: "Featured Product",
      defaultValue: false,
    },
  ],
};

export default Products;
