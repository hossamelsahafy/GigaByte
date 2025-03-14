const Media = {
  slug: "media",
  upload: true,
  fields: [],
  access: {
    read: ({ req }) => true,
    create: ({ req }) => req.user?.role === "admin",
    update: ({ req }) => req.user?.role === "admin",
    delete: ({ req }) => req.user?.role === "admin",
  },
  admin: {
    hidden: ({ user }) => user?.role != "admin",
  },
};

export default Media;
