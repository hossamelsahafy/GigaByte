import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "../../../lib/dbConnect.js";

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
  ],
  adapter: MongoDBAdapter(clientPromise),
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user, account }) {
      console.log("JWT Callback:", { token, user, account });
      if (user) {
        token.id = user.id;
        token.firstName = user.name?.split(" ")[0] || "";
        token.lastName = user.name?.split(" ").slice(1).join(" ") || "";
        token.provider = account?.provider || "local";
        token.providerId = account?.providerAccountId || null;
      }
      return token;
    },
    async session({ session, token }) {
      console.log("Session Callback:", { session, token });
      session.user = session.user || {};
      if (token?.id) {
        session.user.id = token.id;
      }
      if (token?.firstName) {
        session.user.firstName = token.firstName;
      }
      if (token?.lastName) {
        session.user.lastName = token.lastName;
      }
      if (token?.provider) {
        session.user.provider = token.provider;
      }
      if (token?.providerId) {
        session.user.providerId = token.providerId;
      }
      return session;
    },
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        const [firstName, ...lastNameArr] = user.name?.split(" ") || ["", ""];
        const lastName = lastNameArr.join(" ");
        user.firstName = firstName;
        user.lastName = lastName;
        user.provider = account.provider;
        user.providerId = account.providerAccountId;
      }
      return true;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
