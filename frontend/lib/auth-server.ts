import { betterAuth } from "better-auth";
import { jwt } from "better-auth/plugins";
import { Pool } from "pg";

console.log("Database URL present:", !!process.env.DATABASE_URL);

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false // Often needed for Neon in some local environments
    },
    connectionTimeoutMillis: 5000,
});

pool.on('error', (err) => {
    console.error('[Auth Server] Unexpected error on idle client', err);
});

export const auth = betterAuth({
    database: pool,
    secret: process.env.BETTER_AUTH_SECRET, // Explicitly pass the secret
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
