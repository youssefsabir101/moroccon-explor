
const API_BASE_URL = "/api/maroc";

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
  province?: string;
  commune?: string;
  address?: string;
  code?: string;
  population?: number;
  latitude?: number;
  longitude?: number;
  coordinates?: {
    latitude?: number;
    longitude?: number;
  };
  [key: string]: unknown;
}

export interface ApiResponse<T = unknown> {
  success?: boolean;
  message?: string;
  data?: T;
  items?: unknown[];
  [key: string]: unknown;
}

export type ApiParams = Record<
  string,
  string | number | boolean | undefined | null
>;

function getHeaders(): HeadersInit {
  return {
    Accept: "application/json",
  };
}

export function getDisplayName(
  name?: LocalizedName,
): string {
  if (typeof name === "string") {
    return name;
  }

  if (name && typeof name === "object") {
    return name.fr || name.en || name.ar || "Sans nom";
  }

  return "Sans nom";
}

export async function apiGet<T = unknown>(
  endpoint: string,
  params?: ApiParams,
): Promise<T> {
  const cleanBase = API_BASE_URL.replace(/\/+$/, "");
  const cleanEndpoint = endpoint.replace(/^\/+/, "");

  const query = new URLSearchParams();

  Object.entries(params ?? {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      query.set(key, String(value));
    }
  });

  const queryString = query.toString();
  const url = `${cleanBase}/${cleanEndpoint}${
    queryString ? `?${queryString}` : ""
  }`;

  const response = await fetch(url, {
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
      json.message || `Erreur API : HTTP ${response.status}`,
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

  if (Array.isArray(data)) {
    return data as ApiItem[];
  }

  if (data && typeof data === "object") {
    const nested = data as Record<string, unknown>;

    if (Array.isArray(nested.items)) {
      return nested.items as ApiItem[];
    }

    if (Array.isArray(nested.results)) {
      return nested.results as ApiItem[];
    }
  }

  if (Array.isArray(root.items)) {
    return root.items as ApiItem[];
  }

  if (Array.isArray(root.results)) {
    return root.results as ApiItem[];
  }

  return [];
}

// Fonction générique pour récupérer une liste depuis un endpoint.
export async function getApiItems(
  endpoint: string,
  params?: ApiParams,
): Promise<ApiItem[]> {
  const response = await apiGet<unknown>(endpoint, params);
  return extractItems(response);
}

// GEOGRAPHIE

export const getCities = (params?: ApiParams) =>
  getApiItems("cities", params);

export const getRegions = (params?: ApiParams) =>
  getApiItems("regions", params);

export const getProvinces = (params?: ApiParams) =>
  getApiItems("provinces", params);

export const getCommunes = (params?: ApiParams) =>
  getApiItems("communes", params);

export const getPostalCodes = (params?: ApiParams) =>
  getApiItems("postal-codes", params);

export const getLocations = (params?: ApiParams) =>
  apiGet("locations", params);

// PLACES ET SERVICES

export const getPlaces = (params?: ApiParams) =>
  getApiItems("places", params);

export const getCategories = (params?: ApiParams) =>
  getApiItems("categories", params);

export const getHotels = (params?: ApiParams) =>
  getApiItems("hotels", params);

export const getRestaurants = (params?: ApiParams) =>
  getApiItems("restaurants", params);

export const getHospitals = (params?: ApiParams) =>
  getApiItems("hospitals", params);

export const getClinics = (params?: ApiParams) =>
  getApiItems("clinics", params);

export const getPharmacies = (params?: ApiParams) =>
  getApiItems("pharmacies", params);

export const getCafes = (params?: ApiParams) =>
  getApiItems("cafes", params);

export const getBanks = (params?: ApiParams) =>
  getApiItems("banks", params);

export const getAtms = (params?: ApiParams) =>
  getApiItems("atms", params);

export const getUniversities = (params?: ApiParams) =>
  getApiItems("universities", params);

export const getSchools = (params?: ApiParams) =>
  getApiItems("schools", params);

export const getMosques = (params?: ApiParams) =>
  getApiItems("mosques", params);

export const getParks = (params?: ApiParams) =>
  getApiItems("parks", params);

export const getMuseums = (params?: ApiParams) =>
  getApiItems("museums", params);

export const getGasStations = (params?: ApiParams) =>
  getApiItems("gas-stations", params);

export const getParking = (params?: ApiParams) =>
  getApiItems("parking", params);

export const getAdministrativeOffices = (params?: ApiParams) =>
  getApiItems("administrative-offices", params);

export const getPostOffices = (params?: ApiParams) =>
  getApiItems("post-offices", params);

export const getPorts = (params?: ApiParams) =>
  getApiItems("ports", params);

export const getAirports = (params?: ApiParams) =>
  getApiItems("airports", params);

export const getTrainStations = (params?: ApiParams) =>
  getApiItems("train-stations", params);

export const getTouristAttractions = (params?: ApiParams) =>
  getApiItems("tourist-attractions", params);

// STATISTIQUES

export const getPopulation = (params?: ApiParams) =>
  apiGet("population", params);

export const getPlatformStats = () =>
  apiGet("stats");

// RECHERCHE A PROXIMITE

export const getNearbyPlaces = (params: ApiParams) =>
  getApiItems("nearby", params);

// Ancienne fonction conservée pour compatibilité
export async function getDirectoryItems(
  endpoint: string,
  city?: string,
): Promise<ApiItem[]> {
  return getApiItems(endpoint, {
    city,
    limit: 50,
  });
}
