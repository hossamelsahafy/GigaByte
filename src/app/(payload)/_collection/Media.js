const Media = {
  slug: "media",
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
