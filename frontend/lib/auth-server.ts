import { betterAuth } from "better-auth";
import { jwt } from "better-auth/plugins";
import { Pool } from "pg";

const dbUrl = process.env.DATABASE_URL?.trim();

if (!dbUrl) {
  console.error("❌ CRITICAL: DATABASE_URL is empty or undefined in Vercel environment variables!");
}

// Only create the pool if we have a URL, otherwise let it fail clearly
const pool = dbUrl ? new Pool({
  connectionString: dbUrl,
  ssl: {
    rejectUnauthorized: false
  },
  max: 10,
}) : null;

if (pool) {
  pool.on('error', (err) => {
    console.error('DATABASE_POOL_ERROR:', err);
  });
}

export const auth = betterAuth({
    // If pool is null, this will throw a clear error instead of connecting to 127.0.0.1
    database: pool as any, 
    secret: process.env.BETTER_AUTH_SECRET,
    // Disable encryption to prevent "Failed to decrypt private key" errors
    encryption: {
        enabled: false
    },
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
