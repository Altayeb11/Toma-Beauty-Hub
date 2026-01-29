import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "@shared/schema";

/**
 * We attempt to get the DATABASE_URL from process.env.
 * In Replit, secrets like DATABASE_URL are automatically injected into the environment.
 */
const //databaseUrl = process.env.DATABASE_URL; //

function createClient() {
  // Production fallback: In Replit deployments, DATABASE_URL might not be available
  // as an environment variable initially but individual PG variables might be.
  if (!databaseUrl || databaseUrl.trim() === "") {
    console.error("CRITICAL ERROR: DATABASE_URL is missing or empty in process.env.");
    
    if (process.env.PGHOST && process.env.PGDATABASE && process.env.PGUSER && process.env.PGPASSWORD) {
      console.log("Attempting fallback connection using individual PG environment variables (Production Style)...");
      return postgres({
        host: process.env.PGHOST,
        database: process.env.PGDATABASE,
        username: process.env.PGUSER,
        password: process.env.PGPASSWORD,
        port: Number(process.env.PGPORT) || 5432,
        ssl: 'require', // Production usually requires SSL
        connect_timeout: 10,
        idle_timeout: 20,
      });
    } else {
      // If we are truly in production and everything is missing, we might be using the Supabase logic
      // However, the server still needs a DB for sessions and existing logic.
      console.warn("No database variables found. Application might fail if it relies on local Postgres.");
      throw new Error("DATABASE_URL is missing. Please ensure the Replit Database tool or production secrets are set.");
    }
  }

  return postgres(databaseUrl, {
    ssl: 'require', // Added SSL requirement for production stability
    connect_timeout: 10,
    idle_timeout: 20,
  });
}

export const client = createClient();
export const pool = client;
export const db = drizzle(client, { schema });
