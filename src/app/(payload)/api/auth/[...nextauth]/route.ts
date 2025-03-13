import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "../../../lib/dbConnect.js";
import { compare } from "bcryptjs";
import jwt from "jsonwebtoken";

const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const client = await clientPromise;
        const db = client.db();

        const user = await db
          .collection("users")
          .findOne({ email: credentials.email });
        if (!user) {
          throw new Error("No user found with this email.");
        }
        console.log(user);

        const isValid = await compare(credentials.password, user.password);
        if (!isValid) {
          throw new Error("Invalid password.");
        }

        return {
          id: user._id.toString(),
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
          role: user.role || "user",
          phoneNumber: user.phoneNumber || "",
        };
      },
    }),
  ],
  adapter: MongoDBAdapter(clientPromise),
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.role = user.role || "user";
        token.provider = account?.provider || "credentials";

        token.phoneNumber = user.phoneNumber ? user.phoneNumber : null;
      }
      return token;
    },
    async session({ token }) {
      return {
        token: jwt.sign(
          {
            id: token.id,
            email: token.email,
            role: token.role,
            name: token.name,
            provider: token.provider,
            phoneNumber: token.phoneNumber,
          },
          process.env.JWT_SECRET,
          { expiresIn: "7d" }
        ),
      };
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
