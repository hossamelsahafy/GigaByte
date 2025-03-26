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
  // callbacks: {
  //   async jwt({
  //     token,
  //     user,
  //     account,
  //   }: {
  //     //@ts-ignore
  //     token: JWT;
  //     user?: User;
  //     //@ts-ignore
  //     account?: Account | null;
  //   }) {
  //     if (user) {
  //       const customUser = user as CustomUser;
  //       const fullName = customUser.name || "";
  //       const nameParts = fullName.split(" ");
  //       const firstName = nameParts[0];
  //       const lastName = nameParts.slice(1).join(" ");
  //       return {
  //         ...token,
  //         id: customUser.id,
  //         name: fullName,
  //         email: customUser.email,
  //         role: customUser.role || "user",
  //         provider: account?.provider || "credentials",
  //         phoneNumber: customUser.phoneNumber || null,
  //         firstName: firstName || "",
  //         lastName: lastName || "",
  //       };
  //     }
  //     return token;
  //   },

  //   //@ts-ignore
  //   async session({ session, token }: { session: Session; token: JWT }) {
  //     return {
  //       ...session,
  //       user: {
  //         ...session.user,
  //         id: token.id,
  //         role: token.role,
  //         phoneNumber: token.phoneNumber,
  //         firstName: token.firstName,
  //         lastName: token.lastName,
  //       },
  //       token: jwt.sign(
  //         {
  //           id: token.id,
  //           email: token.email,
  //           role: token.role,
  //           name: token.name,
  //           provider: token.provider,
  //           phoneNumber: token.phoneNumber,
  //           firstName: token.firstName,
  //           lastName: token.lastName,
  //         },
  //         process.env.JWT_SECRET!,
  //         { expiresIn: "7d" }
  //       ),
  //     };
  //   },
  // },

  callbacks: {
    async jwt({
      token,
      user,
      account,
      //@ts-ignore

      trigger,
      //@ts-ignore

      session,
    }: {
      //@ts-ignore
      token: JWT;
      user?: User;
      //@ts-ignore
      account?: Account | null;
    }) {
      if (trigger === "update" && session?.token) {
        const decoded = jwt.decode(session.token) as JWT;
        return {
          ...token,
          ...decoded,
        };
      }
      if (user) {
        const customUser = user as CustomUser;
        const fullName = customUser.name || "";
        const nameParts = fullName.split(" ");
        const firstName = nameParts[0];
        const lastName = nameParts.slice(1).join(" ");
        return {
          ...token,
          id: customUser.id,
          name: fullName,
          email: customUser.email,
          role: customUser.role || "user",
          provider: account?.provider || "credentials",
          phoneNumber: customUser.phoneNumber || null,
          firstName: firstName || "",
          lastName: lastName || "",
        };
      }
      return token;
    },

    //@ts-ignore
    async session({ session, token }: { session: Session; token: JWT }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          role: token.role,
          phoneNumber: token.phoneNumber,
          firstName: token.firstName,
          lastName: token.lastName,
        },
        token: jwt.sign(
          {
            id: token.id,
            email: token.email,
            role: token.role,
            name: token.name,
            provider: token.provider,
            phoneNumber: token.phoneNumber,
            firstName: token.firstName,
            lastName: token.lastName,
          },
          process.env.JWT_SECRET!,
          { expiresIn: "7d" }
        ),
      };
    },
  },
};
//
// @ts-ignore
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
