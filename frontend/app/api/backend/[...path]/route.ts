import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
    const { path } = await params;
    return proxyRequest(request, path);
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
    const { path } = await params;
    return proxyRequest(request, path);
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
    const { path } = await params;
    return proxyRequest(request, path);
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
    const { path } = await params;
    return proxyRequest(request, path);
}

async function proxyRequest(request: NextRequest, pathSegments: string[]) {
    // Get backend URL from env, ensuring no trailing /api
    const backendUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/api$/, '') || "https://ashwariyagopal-hackathon2-phase-3-chatbot.hf.space";
    const path = pathSegments.join("/");
    const searchParams = request.nextUrl.searchParams.toString();
    const url = `${backendUrl}/api/${path}${searchParams ? `?${searchParams}` : ""}`;

    // Get the token from the cookie
    const token = request.cookies.get("better-auth.session_token")?.value || 
                  request.cookies.get("__Secure-better-auth.session_token")?.value;

    const headers = new Headers();
    headers.set("Content-Type", "application/json");
    if (token) {
        headers.set("Authorization", `Bearer ${token}`);
    }

    try {
        const body = request.method !== "GET" && request.method !== "HEAD" 
            ? await request.text() 
            : undefined;

        const response = await fetch(url, {
            method: request.method,
            headers: headers,
            body: body,
        });

        // Handle empty or non-JSON responses
        const contentType = response.headers.get("content-type");
        if (response.status === 204 || !contentType || !contentType.includes("application/json")) {
            return new Response(null, { status: response.status });
        }

        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
    } catch (error: any) {
        console.error("Proxy Error:", error);
        return NextResponse.json({ error: "Backend unreachable", details: error.message }, { status: 502 });
    }
}
