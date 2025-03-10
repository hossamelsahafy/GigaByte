import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials"; // ✅ Use this for NextAuth v5+
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "../lib/dbConnect.js";
import bcrypt from "bcryptjs"; // ✅ Ensure bcrypt is installed

export const authConfig = {
  adapter: MongoDBAdapter(clientPromise), // ✅ Add MongoDB Adapter
  providers: [
    Credentials({
      name: "Sign in",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "example@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing email or password");
        }

        const db = (await clientPromise).db();
        const user = await db
          .collection("users")
          .findOne({ email: credentials.email });

        if (!user) {
          throw new Error("No user found with this email");
        }

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );
        if (!isValid) {
          throw new Error("Invalid password");
        }

        return { id: user._id, name: user.name, email: user.email };
      },
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),

    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    }),
  ],
  session: {
    strategy: "jwt",
  },
};

export default (req, res) => NextAuth(req, res, authConfig);
