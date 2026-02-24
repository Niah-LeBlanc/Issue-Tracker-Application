// auth.js — Better Auth configuration
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { getClient, getDatabase } from "./database.js";
import dotenv from "dotenv";

dotenv.config();

// Initialize DB connection then export auth
const client = await getClient();
const db = await getDatabase();

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:5000",

  trustedOrigins: [
    "http://localhost:5173",
    "http://localhost:3000",
    "http://localhost:8080",
    "https://lawnconnect-service-294349793000.us-central1.run.app",
  ],

  database: mongodbAdapter(db, { client }),

  emailAndPassword: { enabled: true },

  session: {
    cookieCache: true,
    maxAge: 60 * 60, // fix: better-auth expects seconds (3600), not milliseconds
    secure: process.env.NODE_ENV === "production",
  },

  user: {
    additionalFields: {
      role: { type: "array", of: "string", required: false },
      profile: { type: "object", required: false },
    },
  },

  debug: process.env.NODE_ENV === "development",
});
