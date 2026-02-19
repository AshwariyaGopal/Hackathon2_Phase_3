import { betterAuth } from "better-auth";
import { jwt } from "better-auth/plugins";
import { Pool } from "pg";

if (!process.env.DATABASE_URL) {
    console.error("CRITICAL ERROR: DATABASE_URL is missing in environment variables.");
}

if (!process.env.BETTER_AUTH_SECRET) {
    console.error("CRITICAL ERROR: BETTER_AUTH_SECRET is missing in environment variables.");
}

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    },
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
});

pool.on('error', (err) => {
    console.error('Unexpected error on idle database client', err);
});

export const auth = betterAuth({
    database: pool,
    secret: process.env.BETTER_AUTH_SECRET,
    // ... rest of config
    onNodeError: (error) => {
        console.error("Better Auth Node Error:", error);
    },
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
