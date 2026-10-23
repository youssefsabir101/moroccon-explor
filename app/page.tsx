
import SearchBar from "../components/SearchBar";
import CategoryCard from "../components/CategoryCard";

const categories = [
  {
    title: "Tourisme",
    description: "Découvrez les villes, hôtels et lieux à visiter au Maroc.",
    href: "/tourism",
    icon: "🏝️",
  },
  {
    title: "Éducation",
    description: "Recherchez des établissements et des ressources éducatives.",
    href: "/education",
    icon: "🎓",
  },
  {
    title: "Services",
    description: "Trouvez des services utiles comme les pharmacies et hôpitaux.",
    href: "/services",
    icon: "🏥",
  },
  {
    title: "Immobilier",
    description: "Une rubrique pour les annonces et informations immobilières.",
    href: "/real-estate",
    icon: "🏠",
  },
  {
    title: "Livraison",
    description: "Explorez les villes et préparez les futures fonctionnalités de livraison.",
    href: "/delivery",
    icon: "🚚",
  },
];

export default function HomePage() {
  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-950 via-emerald-800 to-teal-700 text-white">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:py-28">
          <p className="mb-4 font-semibold text-emerald-200">
            BIENVENUE AU MAROC
          </p>

          <h1 className="max-w-3xl text-4xl font-black leading-tight sm:text-6xl">
            Découvrez le Maroc,
            <span className="block text-orange-300">
              à votre façon.
            </span>
          </h1>

          <p className="mt-6 max-w-2xl leading-7 text-emerald-50">
            Un point de départ pour explorer les villes, découvrir des lieux,
            trouver des services et accéder aux informations utiles.
          </p>

          <div className="mt-9">
            <SearchBar />
          </div>

          <p className="mt-4 text-sm text-emerald-100">
            Explorez les différentes rubriques de Maroc Explorer.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16">
        <div className="mb-8">
          <p className="text-sm font-bold uppercase tracking-wider text-emerald-700">
            Explorez
          </p>
          <h2 className="mt-2 text-3xl font-black text-slate-900">
            Que recherchez-vous ?
          </h2>
          <p className="mt-3 max-w-2xl leading-7 text-slate-600">
            Choisissez une rubrique pour commencer votre recherche.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <CategoryCard key={category.href} {...category} />
          ))}
        </div>
      </section>
    </>
  );
}
