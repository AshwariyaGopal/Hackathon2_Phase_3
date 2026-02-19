const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
const isServer = typeof window === "undefined";

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
      token = cookieStore.get("better-auth.session_token")?.value || 
              cookieStore.get("__Secure-better-auth.session_token")?.value;
    } else {
      // On client, try multiple cookie names used by Better Auth
      const getCookie = (name: string) => {
        const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
        return match ? match[2] : undefined;
      };
      
      token = getCookie("better-auth.session_token") || 
              getCookie("__Secure-better-auth.session_token") ||
              getCookie("better-auth.session_token.production");
    }

    if (token) {
      console.log(`[API Request ${requestId}] SUCCESS: Token found, adding to Authorization header.`);
      // IMPORTANT: Explicitly add to headers for cross-domain requests
      headers["Authorization"] = `Bearer ${token}`;
    } else {
      console.error(`[API Request ${requestId}] ERROR: No session token found in any cookie!`);
    }

    // Force CORS headers if needed
    options.mode = "cors";
    options.credentials = "include";
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
      let errorMessage = `API Error: ${response.statusText}`;
      try {
        const errorData = await response.json();
        // Handle FastAPI validation errors (422)
        if (response.status === 422 && errorData.detail) {
          errorMessage = `Validation Error: ${JSON.stringify(errorData.detail)}`;
        } else {
          errorMessage = errorData.detail || errorData.message || errorMessage;
        }
      } catch {
        // ignore json parse error
      }
      
      console.error(`[API Request ${requestId}] FAILED:`, errorMessage);
      throw new Error(errorMessage);
    }

    if (response.status === 204) {
      return {} as T;
    }

    return response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Request timed out after 120 seconds. Please check your connection.');
    }
    throw error;
  }
}