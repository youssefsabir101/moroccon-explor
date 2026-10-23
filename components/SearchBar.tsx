
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SearchBar() {
  const [search, setSearch] = useState("");
  const router = useRouter();

  function handleSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const value = search.trim();

    if (!value) return;

    router.push(`/tourism?search=${encodeURIComponent(value)}`);
  }

  return (
    <form
      onSubmit={handleSearch}
      className="mx-auto flex w-full max-w-2xl flex-col gap-3 rounded-2xl bg-white p-3 shadow-lg sm:flex-row"
    >
      <input
        type="search"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Ville, hôtel, restaurant..."
        aria-label="Rechercher une ville ou un lieu"
        className="min-w-0 flex-1 rounded-xl border border-slate-200 px-4 py-3 text-slate-800 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
      />

      <button
        type="submit"
        className="rounded-xl bg-emerald-700 px-6 py-3 font-semibold text-white transition hover:bg-emerald-800"
      >
        Rechercher
      </button>
    </form>
  );
}
