/* eslint-disable */
import NextAuth, { NextAuthOptions, User } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "../../../lib/dbConnect.js"; // JS file import
import { compare } from "bcryptjs";
import jwt from "jsonwebtoken";
import type { MongoClient } from "mongodb";

const typedClientPromise: Promise<MongoClient> = clientPromise;

interface CustomUser extends User {
  id: string;
  name: string;
  email: string;
  role: string;
  phoneNumber?: string;
}

interface CustomToken {
  id: string;
  name: string;
  email: string;
  role: string;
  provider: string;
  phoneNumber?: string | null;
  iat?: number;
  exp?: number;
}

const authOptions: NextAuthOptions = {
  providers: [
    // @ts-ignore
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    // @ts-ignore
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
    }),
    // @ts-ignore
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      // @ts-ignore
      async authorize(credentials): Promise<CustomUser | null> {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required.");
        }

        const client = await typedClientPromise;
        const db = client.db();

        const user = await db
          .collection("users")
          .findOne({ email: credentials.email });
        if (!user) {
          throw new Error("No user found with this email.");
        }
        console.log("Found user:", user);

        const isValid = await compare(credentials.password, user.password);
        if (!isValid) {
          throw new Error("Invalid password.");
        }

        return {
          id: user._id.toString(),
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
          role: user.role || "user",
          phoneNumber: user.phoneNumber || undefined,
        };
      },
    }),
  ],
  adapter: MongoDBAdapter(typedClientPromise),
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google" || account?.provider === "facebook") {
        const client = await typedClientPromise;
        const db = client.db();

        const existingUser = await db.collection("users").findOne({
          email: user.email,
        });

        if (!existingUser) {
          await db.collection("users").insertOne({
            firstName: user.name?.split(" ")[0] || "",
            lastName: user.name?.split(" ")[1] || "",
            email: user.email,
            role: "user",
            provider: account.provider,
            phoneNumber: null,
          });
        } else {
          await db
            .collection("users")
            .updateOne(
              { email: user.email },
              { $set: { provider: account.provider } }
            );
        }
      }
      return true;
    },
    //@ts-ignore
    async jwt({ token, user, account }) {
      if (user) {
        const customUser = user as CustomUser;
        token = {
          id: customUser.id,
          //@ts-ignore
          firstName: customUser.firstName,
          //@ts-ignore
          lastName: customUser.lastName,
          email: customUser.email,
          role: customUser.role || "user",
          provider: account?.provider || "credentials",
          phoneNumber: customUser.phoneNumber || null,
        };
      } else if (
        token.email &&
        (account?.provider === "google" || account?.provider === "facebook")
      ) {
        const client = await typedClientPromise;
        const db = client.db();
        const existingUser = await db.collection("users").findOne({
          email: token.email,
        });

        if (existingUser) {
          token = {
            id: existingUser._id.toString(),
            firstName: existingUser.firstName,
            lastName: existingUser.lastName,
            email: existingUser.email,
            role: existingUser.role || "user",
            provider: account.provider,
            phoneNumber: existingUser.phoneNumber || null,
          };
        }
      }
      //@ts-ignore
      return token as CustomToken;
    },
    //@ts-ignore
    async session({ token }) {
      const signedJwt = jwt.sign(
        {
          id: token.id,
          firstName: token.firstName,
          lastName: token.lastName,
          email: token.email,
          role: token.role,
          provider: token.provider,
          phoneNumber: token.phoneNumber,
        },
        process.env.JWT_SECRET!,
        { expiresIn: "7d" }
      );

      return { token: signedJwt };
    },
  },
  //@ts-ignore
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/signin",
  },
};
//@ts-ignore
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
