import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

// هنا نتأكد من قراءة الرابط الذي يسبب الخط الأصفر
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is missing! Please check your Secrets.");
}

export const pool = new Pool({ connectionString });
export const db = drizzle(pool, { schema });
