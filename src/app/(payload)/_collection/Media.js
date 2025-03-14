/** @type {import('payload/types').CollectionConfig} */
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
          console.log("NextAuth session in hook (Media):", session);
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
      name: "altText",
      type: "text",
      label: "Alternative Text",
      required: false,
    },
  ],
};

export default Media;
