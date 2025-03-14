import clientPromise from "../lib/dbConnect.js";

/** @type {import('payload/types').CollectionConfig} */
const Users = {
  slug: "users",
  auth: {
    verify: true,
  },
  access: {
    create: () => true,
    read: async ({ req, id } = {}) => {
      if (!req.user) return false;
      const client = await clientPromise;
      const db = client.db("GigaByte");
      const user = await db.collection("users").findOne({ _id: req.user.id });
      if (!id) return req.user.role === "admin";
      return req.user.role === "admin" || user?._id.toString() === id;
    },
    update: async ({ req, id } = {}) => {
      if (!req.user) return false;
      const client = await clientPromise;
      const db = client.db("GigaByte");
      const user = await db.collection("users").findOne({ _id: req.user.id });
      if (!id) return req.user.role === "admin";
      return req.user.role === "admin" || user?._id.toString() === id;
    },
    delete: async ({ req, id } = {}) => {
      if (!req.user) return false;
      const client = await clientPromise;
      const db = client.db("GigaByte");
      const user = await db.collection("users").findOne({ _id: req.user.id });
      if (!id) return req.user.role === "admin";
      return req.user.role === "admin" || user?._id.toString() === id;
    },
  },
  fields: [
    { name: "firstName", type: "text", required: true },
    { name: "lastName", type: "text", required: true },
    { name: "email", type: "email", required: true, unique: true },
    { name: "password", type: "password", required: true },
    { name: "phoneNumber", type: "text" },
    {
      name: "isVerified",
      type: "checkbox",
      defaultValue: false,
      admin: { description: "Indicates whether the user's email is verified." },
    },
    {
      name: "provider",
      type: "text",
      defaultValue: "local",
      admin: {
        description:
          "The authentication provider (e.g., 'google', 'facebook', 'local').",
      },
    },
    { name: "providerId", type: "text", admin: { hidden: true } },
    { name: "resetToken", type: "text", admin: { hidden: true } },
    { name: "resetTokenExpiration", type: "date", admin: { hidden: true } },
    {
      name: "role",
      type: "select",
      options: [
        { label: "Admin", value: "admin" },
        { label: "User", value: "user" },
      ],
      defaultValue: "user",
      access: {
        read: ({ req }) => req.user?.role === "admin",
        update: ({ req }) => req.user?.role === "admin",
      },
    },
  ],
};

export default Users;
