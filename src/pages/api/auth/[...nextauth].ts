import NextAuth, { type NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import InstagramProvider from "next-auth/providers/instagram";

// Prisma adapter for NextAuth, optional and can be removed
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "../../../server/db/client";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    InstagramProvider({
      clientId: process.env.INSTAGRAM_ID,
      clientSecret: process.env.INSTAGRAM_SECRET,
    }),
  ],
};

export default NextAuth(authOptions);
