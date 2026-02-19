import { betterAuth } from "better-auth";

export const auth = betterAuth({
    database: {
        dialect: "postgres",
        connectionString: "postgresql://neondb_owner:npg_lcWv5TPS7Ggb@ep-weathered-silence-a76g0a2t-pooler.ap-southeast-2.aws.neon.tech/neondb?sslmode=require",
    },
    secret: "By1kFh4jR822D93OLUbnnHNyD9H1Oej9",
    emailAndPassword: {
        enabled: true,
    }
});

export default auth;
