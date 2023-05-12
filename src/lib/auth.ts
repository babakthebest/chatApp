import { UpstashRedisAdapter } from "@next-auth/upstash-redis-adapter";
import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { db } from "./db";

function getGoogleCredentials() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  if (!clientId || clientId.length === 0) {
    throw new Error("missing google client id");
  }
  if (!clientSecret || clientSecret.length === 0) {
    throw new Error("missing google client secret");
  }
  return { clientId, clientSecret };
}

export const authOption: NextAuthOptions = {
  adapter: UpstashRedisAdapter(db),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "./login",
  },
  providers: [
    GoogleProvider({
      clientId: getGoogleCredentials().clientId,
      clientSecret: getGoogleCredentials().clientSecret,
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      const dbuser = (await db.get(`user:${token.id}`)) as User | null;
      if (!dbuser) {
        token.id = user!.id;
      }
      return {
        id: dbuser?.id,
        name: dbuser?.email,
        email: dbuser?.email,
        picture: dbuser?.image,
      };
    },
    async session({ session, token }) {
      if (token.id) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.image = token.picture;
      }
      return session;
    },
    redirect() {
      return "/dashboard";
    },
  },
};
