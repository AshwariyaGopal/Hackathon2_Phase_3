import { betterAuth } from "better-auth";
import { jwt } from "better-auth/plugins";
import { Pool } from "pg";

// Helper to safely initialize the pool
const createPool = () => {
  try {
    if (!process.env.DATABASE_URL) {
      console.error("CRITICAL: DATABASE_URL is missing.");
      return null;
    }
    
    return new Pool({
      connectionString: process.env.DATABASE_URL.trim(),
      ssl: {
        rejectUnauthorized: false
      },
      max: 10,
    });
  } catch (e) {
    console.error("FAILED to initialize DB Pool:", e);
    return null;
  }
};

const pool = createPool();

if (pool) {
  pool.on('error', (err) => {
    console.error('Unexpected error on idle database client', err);
  });
}

export const auth = betterAuth({
    database: pool || { provider: "postgresql", url: "" }, // Fallback to avoid immediate crash
    secret: process.env.BETTER_AUTH_SECRET || "default_secret_fallback_for_build",
    debug: true,
    emailAndPassword: {
        enabled: true,
    },
    trustedOrigins: [
        "http://localhost:3000", 
        process.env.NEXT_PUBLIC_APP_URL || "", 
        process.env.NEXT_PUBLIC_BETTER_AUTH_URL || ""
    ].filter(Boolean),
    plugins: [
        jwt(),
    ],
});

export default auth;
