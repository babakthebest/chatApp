import NextAuth from "next-auth/next";
import { authOption } from "./../../../lib/auth";

export default NextAuth(authOption);