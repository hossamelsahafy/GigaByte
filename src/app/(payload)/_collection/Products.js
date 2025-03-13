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
          type: "upload",
          relationTo: "media",
          required: true,
          label: "Image",
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
