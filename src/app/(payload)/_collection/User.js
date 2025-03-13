const Users = {
  slug: "users",
  auth: {
    verify: true,
  },
  access: {
    create: () => true,
    read: ({ req }) => {
      console.log("req.user in read (collection):", req.user);
      return !!req.user;
    },

    delete: async ({ req, id }) => {
      if (!req.user) return false;

      const client = await clientPromise;
      const db = client.db("GigaByte");
      const user = await db.collection("users").findOne({ id: req.user.id });

      return req.user.role === "admin" || user?._id.toString() === id;
    },
  },
  fields: [
    {
      name: "firstName",
      type: "text",
      required: true,
    },
    {
      name: "lastName",
      type: "text",
      required: true,
    },
    {
      name: "email",
      type: "email",
      required: true,
      unique: true,
    },
    {
      name: "password",
      type: "password",
      required: false,
    },
    {
      name: "phoneNumber",
      type: "text",
      required: false,
    },
    {
      name: "isVerified",
      type: "boolean",
      defaultValue: false,
      admin: {
        description: "Indicates whether the user's email is verified.",
      },
    },
    {
      name: "provider",
      type: "text",
      label: "Auth Provider",
      defaultValue: "local",
      admin: {
        description:
          "The authentication provider (e.g., 'google', 'facebook', 'local').",
      },
    },
    {
      name: "providerId",
      type: "text",
      label: "Provider ID",
      admin: {
        hidden: true,
        description: "The unique ID provided by the authentication provider.",
      },
    },
    {
      name: "resetToken",
      type: "text",
      hidden: true,
    },
    {
      name: "resetTokenExpiration",
      type: "date",
      hidden: true,
    },
    {
      name: "role",
      type: "select",
      options: ["admin", "user"],
      defaultValue: "user",
      access: {
        read: ({ req }) => {
          console.log("req.user in read (role field):", req.user);
          return req.user && req.user.role === "admin";
        },
        update: ({ req }) => {
          console.log("req.user in update (role field):", req.user);
          return req.user && req.user.role === "admin";
        },
      },
    },
  ],
};

export default Users;
