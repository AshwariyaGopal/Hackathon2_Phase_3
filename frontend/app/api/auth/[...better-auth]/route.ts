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
    console.log("AUTH_POST_REQUEST:", req.url);
    try {
        return await handler.POST(req);
    } catch (e: any) {
        console.error("AUTH_POST_CRASH:", e);
        return new Response("Internal Server Error", { status: 500 });
    }
};
