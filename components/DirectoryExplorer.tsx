
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

export default function DirectoryExplorer({
  title,
  description,
  endpoints,
}: Props) {
  const [items, setItems] = useState<ApiItem[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setSearch(params.get("search") ?? "");

    let active = true;

    async function loadData() {
      setLoading(true);
      setError("");

      const results = await Promise.allSettled(
        endpoints.map((endpoint) => getDirectoryItems(endpoint)),
      );

      if (!active) return;

      const loadedItems: ApiItem[] = [];
      const errors: string[] = [];

      results.forEach((result, index) => {
        if (result.status === "fulfilled") {
          loadedItems.push(...result.value);
        } else {
          errors.push(endpoints[index]);
        }
      });

      setItems(loadedItems);

      if (loadedItems.length === 0 && errors.length > 0) {
        setError(
          `Impossible de charger les données (${errors.join(", ")}). Vérifie les endpoints, la clé API et les autorisations CORS.`,
        );
      } else if (errors.length > 0) {
        setError(
          `Certaines sources n'ont pas répondu : ${errors.join(", ")}.`,
        );
      }

      setLoading(false);
    }

    loadData();

    return () => {
      active = false;
    };
  }, [endpoints]);

  const filteredItems = useMemo(() => {
    const query = search.trim().toLocaleLowerCase();

    if (!query) return items;

    return items.filter((item) => {
      const searchable = [
        getDisplayName(item.name ?? item.title),
        item.city,
        item.region,
        item.address,
        item.category,
        item.description,
      ]
        .filter(Boolean)
        .join(" ")
        .toLocaleLowerCase();

      return searchable.includes(query);
    });
  }, [items, search]);

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
        placeholder="Filtrer les résultats..."
        aria-label="Filtrer les résultats"
        className="mb-6 w-full max-w-xl rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
      />

      {loading && (
        <p className="rounded-xl bg-slate-50 p-5 text-slate-600">
          Chargement des données...
        </p>
      )}

      {!loading && error && (
        <p
          role="status"
          className="mb-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900"
        >
          {error}
        </p>
      )}

      {!loading && filteredItems.length === 0 && !error && (
        <p className="rounded-xl bg-slate-50 p-5 text-slate-600">
          Aucun résultat trouvé.
        </p>
      )}

      {!loading && filteredItems.length > 0 && (
        <>
          <p className="mb-4 text-sm text-slate-500">
            {filteredItems.length} résultat(s)
          </p>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredItems.map((item, index) => (
              <article
                key={`${String(item.id ?? getDisplayName(item.name))}-${index}`}
                className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:shadow-md"
              >
                <h2 className="text-lg font-bold text-slate-900">
                  {getDisplayName(item.name ?? item.title)}
                </h2>

                {item.category && (
                  <p className="mt-2 text-sm font-medium text-emerald-700">
                    {item.category}
                  </p>
                )}

                {(item.city || item.region) && (
                  <p className="mt-2 text-sm text-slate-600">
                    {[item.city, item.region].filter(Boolean).join(" · ")}
                  </p>
                )}

                {item.address && (
                  <p className="mt-2 text-sm text-slate-600">
                    {item.address}
                  </p>
                )}

                {typeof item.description === "string" && (
                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-500">
                    {item.description}
                  </p>
                )}

                {typeof item.coordinates?.latitude === "number" &&
                  typeof item.coordinates?.longitude === "number" && (
                    <a
                      className="mt-4 inline-block text-sm font-semibold text-emerald-700 hover:underline"
                      href={`https://www.google.com/maps?q=${item.coordinates.latitude},${item.coordinates.longitude}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Voir sur la carte ↗
                    </a>
                  )}
              </article>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
