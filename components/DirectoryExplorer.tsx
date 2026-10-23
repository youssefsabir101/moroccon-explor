
"use client";

import { useEffect, useMemo, useState } from "react";
import {
  getDirectoryItems,
  getDisplayName,
  type ApiItem,
} from "../lib/api";

interface Props {
  title: string;
  description: string;
  endpoints: string[];
}

interface DirectoryEntry {
  item: ApiItem;
  endpoint: string;
}

const ENDPOINT_LABELS: Record<string, string> = {
  hotels: "Hôtel",
  restaurants: "Restaurant",
  cafes: "Café",
  "tourist-attractions": "Attraction touristique",
  museums: "Musée",
  parks: "Parc",
  schools: "École",
  universities: "Université",
  hospitals: "Hôpital",
  clinics: "Clinique",
  pharmacies: "Pharmacie",
  banks: "Banque",
  atms: "Distributeur automatique",
  "gas-stations": "Station-service",
  parking: "Parking",
  mosques: "Mosquée",
  "administrative-offices": "Administration publique",
  "post-offices": "Bureau de poste",
  "train-stations": "Gare ferroviaire",
  airports: "Aéroport",
  ports: "Port",
  "postal-codes": "Code postal",
  regions: "Région",
  provinces: "Province / Préfecture",
  communes: "Commune",
  cities: "Ville",
  places: "Lieu",
  categories: "Catégorie",
};

function getText(value: unknown): string {
  if (typeof value === "string" || typeof value === "number") {
    return String(value);
  }

  if (value && typeof value === "object") {
    return getDisplayName(value as {
      en?: string | null;
      fr?: string | null;
      ar?: string | null;
    });
  }

  return "";
}

function getCoordinates(item: ApiItem) {
  const latitude =
    item.coordinates?.latitude ?? item.latitude;

  const longitude =
    item.coordinates?.longitude ?? item.longitude;

  if (
    typeof latitude !== "number" ||
    typeof longitude !== "number" ||
    !Number.isFinite(latitude) ||
    !Number.isFinite(longitude)
  ) {
    return null;
  }

  return { latitude, longitude };
}

function getItemName(item: ApiItem): string {
  return getDisplayName(item.name ?? item.title);
}

function getUniqueKey(entry: DirectoryEntry): string {
  const { item, endpoint } = entry;

  const identity =
    item.id ??
    [
      getItemName(item),
      item.city,
      item.region,
      item.address,
    ]
      .map((part) => getText(part).trim().toLowerCase())
      .join("|");

  return `${endpoint}|${String(identity)}`;
}

export default function DirectoryExplorer({
  title,
  description,
  endpoints,
}: Props) {
  const [entries, setEntries] = useState<DirectoryEntry[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [failedEndpoints, setFailedEndpoints] = useState<string[]>([]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setSearch(params.get("search") ?? "");

    let active = true;

    async function loadData() {
      setLoading(true);
      setError("");
      setFailedEndpoints([]);

      const results = await Promise.allSettled(
        endpoints.map((endpoint) => getDirectoryItems(endpoint)),
      );

      if (!active) return;

      const loadedEntries: DirectoryEntry[] = [];
      const errors: string[] = [];

      results.forEach((result, index) => {
        const endpoint = endpoints[index];

        if (result.status === "fulfilled") {
          result.value.forEach((item) => {
            loadedEntries.push({ item, endpoint });
          });
        } else {
          console.error(
            `Erreur de chargement pour ${endpoint}:`,
            result.reason,
          );
          errors.push(endpoint);
        }
      });

      // Éliminer les doublons à l'intérieur d'une même source.
      const seen = new Set<string>();
      const uniqueEntries = loadedEntries.filter((entry) => {
        const key = getUniqueKey(entry);

        if (seen.has(key)) return false;

        seen.add(key);
        return true;
      });

      setEntries(uniqueEntries);
      setFailedEndpoints(errors);

      if (uniqueEntries.length === 0 && errors.length > 0) {
        setError(
          `Impossible de charger les données. Sources en erreur : ${errors.join(", ")}.`,
        );
      }

      setLoading(false);
    }

    loadData();

    return () => {
      active = false;
    };
  }, [endpoints]);

  const filteredEntries = useMemo(() => {
    const query = search.trim().toLocaleLowerCase();

    if (!query) return entries;

    return entries.filter(({ item, endpoint }) => {
      const searchable = [
        getItemName(item),
        getText(item.city),
        getText(item.region),
        getText(item.province),
        getText(item.commune),
        getText(item.address),
        getText(item.category),
        getText(item.description),
        getText(item.code),
        endpoint,
        ENDPOINT_LABELS[endpoint] ?? endpoint,
      ]
        .filter(Boolean)
        .join(" ")
        .toLocaleLowerCase();

      return searchable.includes(query);
    });
  }, [entries, search]);

  return (
    <section className="mx-auto max-w-7xl px-5 py-10">
      <div className="mb-7">
        <p className="mb-2 text-sm font-bold uppercase tracking-wider text-emerald-700">
          Maroc Explorer
        </p>

        <h1 className="text-3xl font-black text-slate-900 sm:text-4xl">
          {title}
        </h1>

        <p className="mt-3 max-w-2xl leading-7 text-slate-600">
          {description}
        </p>
      </div>

      <input
        type="search"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Rechercher par nom, ville, région ou catégorie..."
        aria-label="Rechercher dans les résultats"
        className="mb-6 w-full max-w-xl rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
      />

      {loading && (
        <p className="rounded-xl bg-slate-50 p-5 text-slate-600">
          Chargement des données...
        </p>
      )}

      {!loading && error && (
        <div
          role="alert"
          className="mb-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900"
        >
          {error}
        </div>
      )}

      {!loading && !error && failedEndpoints.length > 0 && (
        <p
          role="status"
          className="mb-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900"
        >
          Certaines sources n'ont pas répondu :{" "}
          {failedEndpoints.join(", ")}.
        </p>
      )}

      {!loading && filteredEntries.length === 0 && !error && (
        <p className="rounded-xl bg-slate-50 p-5 text-slate-600">
          Aucun résultat trouvé.
        </p>
      )}

      {!loading && filteredEntries.length > 0 && (
        <>
          <p className="mb-4 text-sm text-slate-500">
            {filteredEntries.length} résultat(s)
          </p>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredEntries.map((entry) => {
              const { item, endpoint } = entry;
              const coordinates = getCoordinates(item);

              return (
                <article
                  key={getUniqueKey(entry)}
                  className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:shadow-md"
                >
                  <p className="mb-2 inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800">
                    {ENDPOINT_LABELS[endpoint] ?? endpoint}
                  </p>

                  <h2 className="text-lg font-bold text-slate-900">
                    {getItemName(item)}
                  </h2>

                  {item.category && (
                    <p className="mt-2 text-sm font-medium text-emerald-700">
                      {getText(item.category)}
                    </p>
                  )}

                  {(item.city ||
                    item.region ||
                    item.province ||
                    item.commune) && (
                    <p className="mt-2 text-sm text-slate-600">
                      {[
                        getText(item.city),
                        getText(item.commune),
                        getText(item.province),
                        getText(item.region),
                      ]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                  )}

                  {item.address && (
                    <p className="mt-2 text-sm text-slate-600">
                      {getText(item.address)}
                    </p>
                  )}

                  {item.code && (
                    <p className="mt-2 text-sm text-slate-600">
                      Code : {getText(item.code)}
                    </p>
                  )}

                  {typeof item.population === "number" && (
                    <p className="mt-2 text-sm text-slate-600">
                      Population :{" "}
                      {item.population.toLocaleString("fr-FR")}
                    </p>
                  )}

                  {typeof item.description === "string" && (
                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-500">
                      {item.description}
                    </p>
                  )}

                  {coordinates && (
                    <a
                      className="mt-4 inline-block text-sm font-semibold text-emerald-700 hover:underline"
                      href={`https://www.google.com/maps?q=${coordinates.latitude},${coordinates.longitude}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Voir sur la carte ↗
                    </a>
                  )}
                </article>
              );
            })}
          </div>
        </>
      )}
    </section>
  );
}
