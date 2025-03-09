// src/app/(payload)/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Facebook from "next-auth/providers/facebook";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }

  interface JWT {
    id?: string;
  }
}

const { handlers, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Facebook({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user?.id) {
        token.id = typeof user.id === "string" ? user.id : String(user.id);
      }
      return token;
    },
    async session({ session, token }) {
      if (token.id && typeof token.id === "string") {
        session.user.id = token.id;
      } else {
        console.error("Invalid token.id type:", token.id);
        session.user.id = "unknown";
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET!,
});

export const { GET, POST } = handlers;
