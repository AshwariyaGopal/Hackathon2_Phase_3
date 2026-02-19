import { auth } from "@/lib/auth-server";
import { toNextJsHandler } from "better-auth/next-js";

const handler = toNextJsHandler(auth);

export const GET = async (req: Request) => {
    try {
        return await handler.GET(req);
    } catch (e: any) {
        return new Response(JSON.stringify({ 
            error: "AUTH_GET_CRASH", 
            message: e.message,
            stack: e.stack
        }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
};

export const POST = async (req: Request) => {
    try {
        return await handler.POST(req);
    } catch (e: any) {
        return new Response(JSON.stringify({ 
            error: "AUTH_POST_CRASH", 
            message: e.message,
            stack: e.stack
        }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
};
