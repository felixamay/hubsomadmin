import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { verifySync } from "otplib";
import { adminStore } from "@/infrastructure/persistence/store";
import { authConfig } from "@/infrastructure/auth/auth.config";
import type { AdminRole } from "@/domain/enums";
import type { Permission } from "@/domain/permissions";

declare module "next-auth" {
  interface User {
    role?: AdminRole;
    permissions?: Permission[];
    mfaVerified?: boolean;
  }
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: AdminRole;
      permissions: Permission[];
      mfaVerified: boolean;
    };
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    id?: string;
    role?: AdminRole;
    permissions?: Permission[];
    mfaVerified?: boolean;
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      id: "credentials",
      name: "Email and Password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        mfaCode: { label: "MFA Code", type: "text" },
      },
      async authorize(credentials) {
        const email = String(credentials?.email ?? "").trim().toLowerCase();
        const password = String(credentials?.password ?? "");
        const mfaCode = String(credentials?.mfaCode ?? "").trim();

        if (!email || !password) return null;

        const admin = adminStore.findAdminByEmail(email);
        if (!admin || admin.status !== "active") {
          adminStore.addLoginHistory({
            adminId: "unknown",
            email,
            success: false,
            ipAddress: "0.0.0.0",
            userAgent: "admin-portal",
            mfaUsed: false,
            createdAt: new Date().toISOString(),
            failureReason: "Unknown account or inactive",
          });
          return null;
        }

        const valid = await bcrypt.compare(password, admin.passwordHash);
        if (!valid) {
          adminStore.addLoginHistory({
            adminId: admin.id,
            email,
            success: false,
            ipAddress: "0.0.0.0",
            userAgent: "admin-portal",
            mfaUsed: false,
            createdAt: new Date().toISOString(),
            failureReason: "Invalid password",
          });
          return null;
        }

        if (admin.mfaEnabled) {
          if (!mfaCode) {
            throw new Error("MFA_REQUIRED");
          }
          const ok = admin.mfaSecret
            ? verifySync({ token: mfaCode, secret: admin.mfaSecret }).valid
            : false;
          if (!ok) {
            adminStore.addLoginHistory({
              adminId: admin.id,
              email,
              success: false,
              ipAddress: "0.0.0.0",
              userAgent: "admin-portal",
              mfaUsed: true,
              createdAt: new Date().toISOString(),
              failureReason: "Invalid MFA code",
            });
            return null;
          }
        }

        adminStore.addLoginHistory({
          adminId: admin.id,
          email,
          success: true,
          ipAddress: "0.0.0.0",
          userAgent: "admin-portal",
          mfaUsed: admin.mfaEnabled,
          createdAt: new Date().toISOString(),
        });

        return {
          id: admin.id,
          email: admin.email,
          name: admin.name,
          role: admin.role,
          permissions: admin.permissions as Permission[],
          mfaVerified: true,
        };
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.permissions = user.permissions;
        token.mfaVerified = user.mfaVerified;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = String(token.id ?? "");
        session.user.role = token.role as AdminRole;
        session.user.permissions = (token.permissions as Permission[]) ?? [];
        session.user.mfaVerified = Boolean(token.mfaVerified);
      }
      return session;
    },
  },
  secret: process.env.AUTH_SECRET,
});
