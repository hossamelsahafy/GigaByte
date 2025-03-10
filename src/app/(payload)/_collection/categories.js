const Categories = {
  slug: "categories",
  admin: {
    useAsTitle: "name",
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
      type: "upload",
      relationTo: "media",
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
