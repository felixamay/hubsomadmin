import type { NextAuthConfig } from "next-auth";

/** Edge-safe Auth.js config (no Node fs / bcrypt). */
export const authConfig = {
  pages: {
    signIn: "/login",
  },
  session: { strategy: "jwt", maxAge: 60 * 60 * 8 },
  providers: [],
  callbacks: {
    authorized({ auth: session, request }) {
      const path = request.nextUrl.pathname;
      if (path.startsWith("/login") || path.startsWith("/api/auth")) return true;
      return !!session?.user;
    },
  },
  trustHost: true,
} satisfies NextAuthConfig;
