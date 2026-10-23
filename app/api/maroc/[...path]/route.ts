
import { NextRequest, NextResponse } from "next/server";

const ALLOWED_ENDPOINTS = new Set([
  // Geography
  "cities",
  "regions",
  "provinces",
  "communes",
  "postal-codes",
  "locations",
  "nearby",

  // Places
  "categories",
  "places",
  "hotels",
  "restaurants",
  "hospitals",
  "clinics",
  "cafes",
  "pharmacies",
  "banks",
  "atms",
  "universities",
  "schools",
  "mosques",
  "parks",
  "museums",
  "gas-stations",
  "parking",
  "administrative-offices",
  "post-offices",
  "ports",
  "airports",
  "train-stations",
  "tourist-attractions",

  // Statistics
  "population",
  "stats",
]);

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  const apiBase = process.env.MAROC_API_BASE_URL;
  const apiKey = process.env.MAROC_API_KEY;
  const { path } = await context.params;

  if (!apiBase) {
    return NextResponse.json(
      { message: "MAROC_API_BASE_URL is missing in .env.local." },
      { status: 500 },
    );
  }

  if (path.length !== 1 || !ALLOWED_ENDPOINTS.has(path[0])) {
    return NextResponse.json(
      { message: "Endpoint not allowed.", path },
      { status: 404 },
    );
  }

  const url = new URL(
    `${apiBase.replace(/\/+$/, "")}/${path[0]}`,
  );

  request.nextUrl.searchParams.forEach((value, key) => {
    url.searchParams.set(key, value);
  });

  const headers: Record<string, string> = {
    Accept: "application/json",
  };

  // Le endpoint stats peut fonctionner sans clé.
  if (apiKey) {
    headers["X-API-Key"] = apiKey;
  }

  try {
    const response = await fetch(url.toString(), {
      method: "GET",
      headers,
      cache: "no-store",
    });

    const body = await response.text();

    return new NextResponse(body, {
      status: response.status,
      headers: {
        "Content-Type":
          response.headers.get("content-type") ??
          "application/json",
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Maroc API connection error:", error);

    return NextResponse.json(
      { message: "Could not connect to Maroc APIs." },
      { status: 502 },
    );
  }
}
