import { betterAuth } from "better-auth";
import { jwt } from "better-auth/plugins";
import { Pool } from "pg";

if (!process.env.DATABASE_URL) {
    console.error("DATABASE_CONNECTION_ERROR: DATABASE_URL is missing from environment variables.");
}

if (!process.env.BETTER_AUTH_SECRET) {
    console.error("AUTH_CONFIG_ERROR: BETTER_AUTH_SECRET is missing from environment variables.");
}

const pool = new Pool({
    connectionString: process.env.DATABASE_URL?.trim(), // Ensure no whitespace
    ssl: {
        rejectUnauthorized: false
    },
});

pool.on('error', (err) => {
    console.error('Unexpected error on idle database client', err);
});

export const auth = betterAuth({
    database: pool,
    secret: process.env.BETTER_AUTH_SECRET,
    debug: true, // Show detailed error info in Vercel logs
    onNodeError: (error: any) => {
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

export default auth;
