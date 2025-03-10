const Users = {
  slug: "users",
  auth: {
    verify: true,
  },
  access: {
    create: () => true,
    read: ({ req }) => {
      return !!req.user;
    },
    update: ({ req, data }) => {
      if (req.user.role === "admin" || req.user.id === data.id) return true;
      return false;
    },
    delete: ({ req }) => {
      return req.user.role === "admin";
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
      options: ["admin", "editor", "user"],
      defaultValue: "user",
      access: {
        read: ({ req }) => req.user.role === "admin",
        update: ({ req }) => req.user.role === "admin",
      },
    },
  ],
};

export default Users;
