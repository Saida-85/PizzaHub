import dns from "node:dns";
import { betterAuth } from "better-auth";
import { createAuthMiddleware, APIError } from "better-auth/api";
import { jwt } from "better-auth/plugins";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";

// Dev only: some networks refuse the SRV lookup that mongodb+srv:// needs
if (process.env.NODE_ENV === "development") {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
}

const client = new MongoClient(process.env.MONGODB_URI as string, {
  serverSelectionTimeoutMS: 8000,
});
const db = client.db("pizzahubdb");

export const auth = betterAuth({
  database: mongodbAdapter(db, { client }),
  plugins: [jwt()],
  emailAndPassword: { enabled: true, minPasswordLength: 6 },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  user: {
    additionalFields: {
      role: { type: "string", defaultValue: "customer", input: true },
      businessName: { type: "string", required: false, input: true },
      isBlocked: { type: "boolean", defaultValue: false, input: false },
      subscriptionPlan: { type: "string", defaultValue: "free", input: false },
      subscriptionExpiresAt: { type: "date", required: false, input: false },
    },
  },
  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      if (ctx.path === "/sign-up/email") {
        const pw = String(ctx.body?.password ?? "");
        if (!/[A-Z]/.test(pw) || !/[a-z]/.test(pw)) {
          throw new APIError("BAD_REQUEST", {
            message: "Password needs one uppercase and one lowercase letter.",
          });
        }
      }
    }),
  },
  databaseHooks: {
    user: {
      create: {
        before: async (user) => ({
          data: { ...user, role: user.role === "vendor" ? "vendor" : "customer" },
        }),
      },
      update: {
        before: async (data) => {
          const d = { ...data } as Record<string, unknown>;
          delete d.role;
          delete d.isBlocked;
          delete d.subscriptionPlan;
          delete d.subscriptionExpiresAt;
          return { data: d };
        },
      },
    },
  },
});