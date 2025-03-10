const Comments = {
  slug: "comments",
  admin: {
    useAsTitle: "comment", // ✅ Use "comment" instead of "name"
  },
  fields: [
    {
      name: "user",
      type: "relationship",
      relationTo: "users",
      required: true,
      label: "User",
    },
    {
      name: "product",
      type: "relationship",
      relationTo: "products",
      required: true,
      label: "Product",
    },
    {
      name: "comment",
      type: "textarea",
      required: true,
      label: "Comment",
    },
    {
      name: "isApproved",
      type: "checkbox",
      label: "Approved",
      defaultValue: false,
      admin: {
        description:
          "Check this box to approve the comment and make it visible to others.",
      },
    },
    {
      name: "createdAt",
      type: "date",
      label: "Created At",
      admin: {
        readOnly: true,
      },
      defaultValue: () => new Date(),
    },
  ],
  hooks: {
    beforeChange: [
      ({ data }) => {
        if (!data.createdAt) {
          data.createdAt = new Date();
        }
        return data;
      },
    ],
  },
};

export default Comments;
