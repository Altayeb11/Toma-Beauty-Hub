import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "@shared/schema";

// Ensure DATABASE_URL is read correctly. 
// In some environments, it might be set as a secret which is available via process.env
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error("DATABASE_URL is missing from process.env");
  // Fallback or more descriptive error
  throw new Error(
    "DATABASE_URL is missing. Please ensure the Replit Database tool is enabled and the secret is set.",
  );
}

export const client = postgres(databaseUrl);
export const pool = client;
export const db = drizzle(client, { schema });
