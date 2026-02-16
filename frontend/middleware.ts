import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get("better-auth.session_token") || request.cookies.get("__Secure-better-auth.session_token");
  const isProtectedPage = request.nextUrl.pathname.startsWith("/tasks") || request.nextUrl.pathname.startsWith("/chat");

  if (isProtectedPage && !sessionCookie) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/tasks/:path*", "/chat/:path*"],
};