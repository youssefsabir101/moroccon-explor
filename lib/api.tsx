
const API_BASE_URL =
  process.env.NEXT_PUBLIC_MAROC_API_BASE_URL ??
  "https://api.marocapis.com/api/v1";


const API_KEY = process.env.NEXT_PUBLIC_MAROC_API_KEY;

export type LocalizedName =
  | string
  | {
      en?: string | null;
      fr?: string | null;
      ar?: string | null;
    };

export interface ApiItem {
  id?: string | number;
  type?: string;
  name?: LocalizedName;
  title?: LocalizedName;
  description?: string | null;
  category?: string;
  city?: string;
  region?: string;
  address?: string;
  coordinates?: {
    latitude?: number;
    longitude?: number;
  };
  [key: string]: unknown;
}

interface ApiResponse {
  success?: boolean;
  message?: string;
  data?: unknown;
}

function getHeaders(): HeadersInit {
  const headers: Record<string, string> = {
    Accept: "application/json",
  };

  if (API_KEY) {
    headers["X-API-Key"] = API_KEY;
  }

  return headers;
}

export function getDisplayName(
  name?: LocalizedName,
): string {
  if (typeof name === "string") return name;

  if (name && typeof name === "object") {
    return (
      name.fr ||
      name.en ||
      name.ar ||
      "Sans nom"
    );
  }

  return "Sans nom";
}

export async function apiGet<T>(
  endpoint: string,
  params?: Record<string, string | number | undefined>,
): Promise<T> {
  const url = new URL(
    `${API_BASE_URL.replace(/\/+$/, "")}/${endpoint.replace(/^\/+/, "")}`,
  );

  Object.entries(params ?? {}).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      url.searchParams.set(key, String(value));
    }
  });

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: getHeaders(),
    cache: "no-store",
  });

  const body = await response.text();

  let json: ApiResponse;

  try {
    json = JSON.parse(body) as ApiResponse;
  } catch {
    throw new Error(
      `Réponse API invalide (HTTP ${response.status}). Vérifie l'URL.`,
    );
  }

  if (!response.ok) {
    throw new Error(
      json.message ||
        `Erreur API : HTTP ${response.status}`,
    );
  }

  if (json.success === false) {
    throw new Error(json.message || "La requête API a échoué.");
  }

  return json as T;
}

export function extractItems(response: unknown): ApiItem[] {
  if (!response || typeof response !== "object") {
    return [];
  }

  const root = response as Record<string, unknown>;
  const data = root.data;

  // Certains endpoints renvoient data: [...]
  if (Array.isArray(data)) {
    return data as ApiItem[];
  }

  // D'autres renvoient data: { items: [...] }
  if (data && typeof data === "object") {
    const nested = data as Record<string, unknown>;

    if (Array.isArray(nested.items)) {
      return nested.items as ApiItem[];
    }
  }

  // Fallback si la réponse est directement une liste
  if (Array.isArray(root.items)) {
    return root.items as ApiItem[];
  }

  return [];
}

export async function getCities(): Promise<ApiItem[]> {
  const response = await apiGet<unknown>("cities");
  return extractItems(response);
}

export async function getDirectoryItems(
  endpoint: string,
  city?: string,
): Promise<ApiItem[]> {
  const response = await apiGet<unknown>(endpoint, {
    city,
    limit: 50,
  });

  return extractItems(response);
}
