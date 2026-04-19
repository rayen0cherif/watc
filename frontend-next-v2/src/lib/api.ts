export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8081/api/v1";

function getAuthHeaders(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
      ...options?.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API error ${response.status}`);
  }

  // Handle empty responses
  const text = await response.text();
  return text ? JSON.parse(text) : ({} as T);
}

export async function uploadFileApi<T>(endpoint: string, formData: FormData, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "POST",
    body: formData,
    headers: {
      ...getAuthHeaders(),
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`Upload API error ${response.status}`);
  }

  const text = await response.text();
  return text ? JSON.parse(text) : ({} as T);
}
