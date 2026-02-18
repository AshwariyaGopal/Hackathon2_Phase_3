// Use proxy on client to handle HttpOnly cookies, direct URL on server
const isServer = typeof window === "undefined";
const BASE_URL = isServer
  ? (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api")
  : "/api/proxy";

console.log(`[API Client] Environment: ${isServer ? 'Server' : 'Client'}, Base URL: ${BASE_URL}`);

type FetchOptions = RequestInit & {
  requireAuth?: boolean;
};

export async function apiClient<T = unknown>(
  endpoint: string,
  { requireAuth = true, ...options }: FetchOptions = {}
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  const requestId = Math.random().toString(36).substring(7);
  console.log(`[API Request ${requestId}] START: ${endpoint}`);

  // Handle Auth Token
  if (requireAuth) {
    let token: string | undefined;
    
    // Check if we are on the server
    if (typeof window === "undefined") {
      const { cookies } = await import("next/headers");
      const cookieStore = await cookies();
      token = cookieStore.get("better-auth.session_token")?.value || cookieStore.get("__Secure-better-auth.session_token")?.value;
    } else {
      // On client, we can try to get it from cookies directly or session
      // Robust cookie parsing
      const match = document.cookie.match(new RegExp('(^| )(?:__Secure-)?better-auth.session_token=([^;]+)'));
      token = match ? match[2] : undefined;
    }

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    } else {
        // console.warn("API Client: No token found in cookies.");
    }
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 120000); // 120 second timeout

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
      credentials: "include", 
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    console.log(`[API Request ${requestId}] DONE: ${response.status} ${response.statusText}`);

    if (!response.ok) {
      if (response.status === 401 && requireAuth) {
        // Optional: Redirect to login or handle session expiration
        // window.location.href = "/login";
      }
      
      let errorMessage = `API Error: ${response.statusText}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.detail || errorData.message || errorMessage;
      } catch {
        // ignore json parse error
      }
      
      throw new Error(errorMessage);
    }

    if (response.status === 204) {
      return {} as T;
    }

    return response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Request timed out after 60 seconds. Please check your connection.');
    }
    throw error;
  }
}