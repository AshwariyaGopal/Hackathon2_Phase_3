const BASE_URL = "/api/backend";
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

  // In this proxy setup, we don't need to manually set the Authorization header
  // because the Proxy route in Next.js will read the cookie and add it.

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