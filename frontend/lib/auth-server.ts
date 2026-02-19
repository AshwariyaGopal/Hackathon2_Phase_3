import { betterAuth } from "better-auth";
import { jwt } from "better-auth/plugins";
import { Pool } from "pg";

// Safe pool initialization
const pool = new Pool({
  connectionString: process.env.DATABASE_URL?.trim(),
  ssl: {
    rejectUnauthorized: false
  },
  max: 10,
});

pool.on('error', (err) => {
  console.error('DATABASE_POOL_ERROR:', err);
});

export const auth = betterAuth({
    database: pool,
    secret: process.env.BETTER_AUTH_SECRET,
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
