/* eslint-disable */
import NextAuth, { NextAuthOptions, User } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "../../../lib/dbConnect.js";
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
  provider?: string;
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

        // Only compare password for credential provider users
        if (user.provider === "credentials") {
          const isValid = await compare(credentials.password, user.password);
          if (!isValid) {
            throw new Error("Invalid password.");
          }
        }

        return {
          id: user._id.toString(),
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
          role: user.role || "user",
          phoneNumber: user.phoneNumber || undefined,
          provider: user.provider || "credentials",
        };
      },
    }),
  ],
  adapter: MongoDBAdapter(typedClientPromise),
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60, // 7 days
      },
    },
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      const client = await typedClientPromise;
      const db = client.db();

      // Handle Google/Facebook sign-in
      if (account?.provider === "google" || account?.provider === "facebook") {
        const existingUser = await db
          .collection("users")
          .findOne({ email: user.email });

        if (!existingUser) {
          // Extract first and last name from profile or user.name
          let firstName = "";
          let lastName = "";

          if (profile?.name) {
            const nameParts = profile.name.split(" ");
            firstName = nameParts[0];
            lastName = nameParts.slice(1).join(" ");
          } else if (user.name) {
            const nameParts = user.name.split(" ");
            firstName = nameParts[0];
            lastName = nameParts.slice(1).join(" ");
          }

          await db.collection("users").insertOne({
            firstName,
            lastName,
            email: user.email,
            role: "user",
            provider: account.provider,
            phoneNumber: null,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        } else {
          // Update existing user if needed
          await db.collection("users").updateOne(
            { email: user.email },
            {
              $set: {
                provider: account.provider,
                updatedAt: new Date(),
              },
              $setOnInsert: {
                role: "user",
                phoneNumber: null,
                createdAt: new Date(),
              },
            },
            { upsert: true }
          );
        }
      }

      return true;
    },

    async jwt({ token, user, account, profile }) {
      // Initial sign in
      if (user) {
        const customUser = user as CustomUser;
        return {
          id: customUser.id,
          name: customUser.name,
          email: customUser.email,
          role: customUser.role || "user",
          provider: customUser.provider || account?.provider || "credentials",
          phoneNumber: customUser.phoneNumber || null,
        };
      }

      // Subsequent calls - update token from database if needed
      const client = await typedClientPromise;
      const db = client.db();
      const existingUser = await db
        .collection("users")
        .findOne({ email: token.email });

      if (existingUser) {
        token.id = existingUser._id.toString();
        token.name = `${existingUser.firstName} ${existingUser.lastName}`;
        token.role = existingUser.role || "user";
        token.provider = existingUser.provider || "credentials";
        token.phoneNumber = existingUser.phoneNumber || null;
      }

      return token;
    },

    async session({ session, token }) {
      // Create a signed JWT token for client-side use
      const signedToken = jwt.sign(
        {
          id: token.id,
          email: token.email,
          role: token.role,
          name: token.name,
          provider: token.provider,
          phoneNumber: token.phoneNumber,
        },
        process.env.JWT_SECRET!,
        { expiresIn: "7d" }
      );

      // Set the token in the session
      session.token = signedToken;
      session.user = {
        id: token.id as string,
        name: token.name as string,
        email: token.email as string,
        role: token.role as string,
        provider: token.provider as string,
        phoneNumber: token.phoneNumber as string | null,
      };

      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
