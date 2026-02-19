import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: { path: string[] } }) {
    return proxyRequest(request, params.path);
}

export async function POST(request: NextRequest, { params }: { params: { path: string[] } }) {
    return proxyRequest(request, params.path);
}

export async function PUT(request: NextRequest, { params }: { params: { path: string[] } }) {
    return proxyRequest(request, params.path);
}

export async function DELETE(request: NextRequest, { params }: { params: { path: string[] } }) {
    return proxyRequest(request, params.path);
}

async function proxyRequest(request: NextRequest, pathSegments: string[]) {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/api$/, '') || "https://ashwariyagopal-hackathon2-phase-3-chatbot.hf.space";
    const path = pathSegments.join("/");
    const searchParams = request.nextUrl.searchParams.toString();
    const url = `${backendUrl}/api/${path}${searchParams ? `?${searchParams}` : ""}`;

    // Get the token from the cookie (Vercel can read HttpOnly cookies!)
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

        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
    } catch (error: any) {
        console.error("Proxy Error:", error);
        return NextResponse.json({ error: "Backend unreachable", details: error.message }, { status: 502 });
    }
}
