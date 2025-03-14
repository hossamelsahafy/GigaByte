import NextAuth, { NextAuthOptions, User } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "../../../lib/dbConnect.js"; // JS file import
import { compare } from "bcryptjs";
import jwt from "jsonwebtoken";
import type { MongoClient } from "mongodb";

// Type assertion for clientPromise to resolve the 'any' issue
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
    async jwt({ token, user, account }): Promise<CustomToken> {
      if (user) {
        const customUser = user as CustomUser;
        token.id = customUser.id;
        token.name = customUser.name;
        token.email = customUser.email;
        token.role = customUser.role || "user";
        token.provider = account?.provider || "credentials";
        token.phoneNumber = customUser.phoneNumber || null;
      }
      return token as CustomToken;
    },
    async session({ token }): Promise<{ token: string }> {
      const customToken = token as CustomToken;
      return {
        token: jwt.sign(
          {
            id: customToken.id,
            email: customToken.email,
            role: customToken.role,
            name: customToken.name,
            provider: customToken.provider,
            phoneNumber: customToken.phoneNumber,
          },
          process.env.JWT_SECRET!,
          { expiresIn: "7d" }
        ),
      };
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
