
import Link from "next/link";

const links = [
  { href: "/", label: "Accueil" },
  { href: "/tourism", label: "Tourisme" },
  { href: "/education", label: "Éducation" },
  { href: "/services", label: "Services" },
  { href: "/real-estate", label: "Immobilier" },
  { href: "/delivery", label: "Livraison" },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-4">
        <Link
          href="/"
          className="text-2xl font-black tracking-tight text-emerald-800"
        >
          Maroc<span className="text-orange-500">Explorer</span>
        </Link>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-slate-600 transition hover:text-emerald-700"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
