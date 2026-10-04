import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      loginAt?: number;
    } & DefaultSession["user"];
  }
}
