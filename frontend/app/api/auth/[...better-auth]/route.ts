import { auth } from "@/lib/auth-server";
import { toNextJsHandler } from "better-auth/next-js";

const handler = toNextJsHandler(auth);

export const GET = async (req: Request) => {
    console.log("AUTH_GET_REQUEST:", req.url);
    try {
        return await handler.GET(req);
    } catch (e: any) {
        console.error("AUTH_GET_CRASH:", e);
        return new Response("Internal Server Error", { status: 500 });
    }
};

export const POST = async (req: Request) => {
    try {
        return await handler.POST(req);
    } catch (e: any) {
        console.error("AUTH_POST_CRASH:", e);
        return new Response(JSON.stringify({ 
            error: "AUTH_POST_CRASH", 
            message: e.message,
            env_check: {
                has_db_url: !!process.env.DATABASE_URL,
                has_secret: !!process.env.BETTER_AUTH_SECRET,
                auth_url: process.env.BETTER_AUTH_URL
            }
        }), { 
            status: 500, 
            headers: { 'Content-Type': 'application/json' } 
        });
    }
};
