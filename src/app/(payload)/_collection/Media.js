const Media = {
  slug: "media",
  access: {
    read: () => true,
    create: ({ req }) => req.user?.role === "admin",
    update: ({ req }) => req.user?.role === "admin",
    delete: ({ req }) => req.user?.role === "admin",
  },
  upload: {
    staticDir: "uploads",
    mimeTypes: ["image/*"],
    imageSizes: [
      {
        name: "thumbnail",
        width: 150,
        height: 150,
        crop: "center",
      },
      {
        name: "medium",
        width: 600,
        height: 400,
        crop: "center",
      },
      {
        name: "large",
        width: 1200,
        height: 800,
        crop: "center",
      },
    ],
    adminThumbnail: "thumbnail",
  },
  admin: {
    useAsTitle: "filename",
  },
  fields: [
    {
      name: "altText",
      type: "text",
      label: "Alternative Text",
      required: false,
    },
  ],
};

export default Media;
