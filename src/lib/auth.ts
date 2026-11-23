
import dns from "node:dns";
import { betterAuth } from "better-auth";
import { createAuthMiddleware, APIError } from "better-auth/api";
import { jwt } from "better-auth/plugins";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";

// Development-only DNS workaround for MongoDB SRV lookup.
if (process.env.NODE_ENV === "development") {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
}

// Validate required environment variables.
const mongoUri = process.env.MONGODB_URI;
const authSecret = process.env.BETTER_AUTH_SECRET;
const authUrl =
  process.env.BETTER_AUTH_URL ||
  process.env.NEXT_PUBLIC_BETTER_AUTH_URL;

const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

if (!mongoUri) {
  throw new Error("MONGODB_URI environment variable is missing.");
}

if (!authSecret) {
  throw new Error("BETTER_AUTH_SECRET environment variable is missing.");
}

if (!authUrl) {
  throw new Error("BETTER_AUTH_URL environment variable is missing.");
}

if (!googleClientId || !googleClientSecret) {
  throw new Error("Google OAuth credentials are missing.");
}

// MongoDB connection.
const client = new MongoClient(mongoUri, {
  serverSelectionTimeoutMS: 8000,
});

const db = client.db(process.env.DB_NAME || "pizzahubdb");

// Better Auth configuration.
export const auth = betterAuth({
  appName: "PizzaHub",

  baseURL: authUrl,
  secret: authSecret,

  database: mongodbAdapter(db, { client }),

  trustedOrigins: [
    "http://localhost:3000",
    "https://pizza-hub-swart-nine.vercel.app",
  ],

  plugins: [jwt()],

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
  },

  socialProviders: {
    google: {
      clientId: googleClientId,
      clientSecret: googleClientSecret,
    },
  },

  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "customer",
        input: true,
      },

      businessName: {
        type: "string",
        required: false,
        input: true,
      },

      isBlocked: {
        type: "boolean",
        defaultValue: false,
        input: false,
      },

      subscriptionPlan: {
        type: "string",
        defaultValue: "free",
        input: false,
      },

      subscriptionExpiresAt: {
        type: "date",
        required: false,
        input: false,
      },
    },
  },

  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      if (ctx.path === "/sign-up/email") {
        const password = String(ctx.body?.password ?? "");

        if (!/[A-Z]/.test(password) || !/[a-z]/.test(password)) {
          throw new APIError("BAD_REQUEST", {
            message:
              "Password needs one uppercase and one lowercase letter.",
          });
        }
      }
    }),
  },

  databaseHooks: {
    user: {
      create: {
        before: async (user) => ({
          data: {
            ...user,
            role: user.role === "vendor" ? "vendor" : "customer",
          },
        }),
      },

      update: {
        before: async (data) => {
          const updatedData = {
            ...data,
          } as Record<string, unknown>;

          // Prevent users from changing protected account fields.
          delete updatedData.role;
          delete updatedData.isBlocked;
          delete updatedData.subscriptionPlan;
          delete updatedData.subscriptionExpiresAt;

          return {
            data: updatedData,
          };
        },
      },
    },
  },
});
