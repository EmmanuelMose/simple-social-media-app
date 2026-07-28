import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

// Create a PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Test connection
pool.on("connect", () => {
  console.log(" Connected to PostgreSQL");
});

pool.on("error", (err) => {
  console.error(" PostgreSQL connection error:", err);
});

// Initialize Drizzle with the schema
const db = drizzle(pool, { schema, logger: true });

export default db;