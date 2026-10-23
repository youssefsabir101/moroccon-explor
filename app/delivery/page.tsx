
"use client";

import { useEffect, useMemo, useState } from "react";
import {
  getCities,
  getDisplayName,
  type ApiItem,
} from "../../lib/api";

export default function DeliveryPage() {
  const [cities, setCities] = useState<ApiItem[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    getCities()
      .then((data) => {
        if (active) setCities(data);
      })
      .catch((err: unknown) => {
        if (!active) return;

        setError(
          err instanceof Error
            ? err.message
            : "Impossible de charger les villes.",
        );
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const filteredCities = useMemo(() => {
    const query = search.trim().toLocaleLowerCase();

    if (!query) return cities;

    return cities.filter((city) => {
      const name = getDisplayName(city.name).toLocaleLowerCase();
      const region = (city.region ?? "").toLocaleLowerCase();

      return name.includes(query) || region.includes(query);
    });
  }, [cities, search]);

  return (
    <section className="mx-auto max-w-7xl px-5 py-10">
      <p className="text-sm font-bold uppercase tracking-wider text-emerald-700">
        Maroc Explorer
      </p>

      <h1 className="mt-2 text-3xl font-black text-slate-900 sm:text-4xl">
        Livraison et villes
      </h1>

      <p className="mt-3 max-w-2xl leading-7 text-slate-600">
        Recherchez une ville ou une région pour préparer les futures
        fonctionnalités de livraison.
      </p>

      <input
        type="search"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Rechercher une ville..."
        aria-label="Rechercher une ville"
        className="mt-7 w-full max-w-xl rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
      />

      {loading && (
        <p className="mt-6 text-slate-600">Chargement des villes...</p>
      )}

      {error && (
        <p role="alert" className="mt-6 rounded-xl bg-red-50 p-4 text-red-700">
          {error}
        </p>
      )}

      {!loading && !error && filteredCities.length === 0 && (
        <p className="mt-6 rounded-xl bg-slate-100 p-5 text-slate-600">
          Aucune ville trouvée.
        </p>
      )}

      {!loading && filteredCities.length > 0 && (
        <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCities.map((city, index) => (
            <article
              key={String(city.id ?? index)}
              className="rounded-2xl border border-slate-200 bg-white p-5"
            >
              <h2 className="text-lg font-bold text-slate-900">
                {getDisplayName(city.name)}
              </h2>

              {city.region && (
                <p className="mt-2 text-sm text-slate-600">
                  Région : {city.region}
                </p>
              )}

              {typeof city.coordinates?.latitude === "number" &&
                typeof city.coordinates?.longitude === "number" && (
                  <a
                    href={`https://www.google.com/maps?q=${city.coordinates.latitude},${city.coordinates.longitude}`}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 inline-block text-sm font-semibold text-emerald-700 hover:underline"
                  >
                    Voir sur la carte ↗
                  </a>
                )}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
