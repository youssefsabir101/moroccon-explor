
import Link from "next/link";

export default function RealEstatePage() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-16">
      <div className="max-w-3xl rounded-3xl border border-slate-200 bg-white p-8 sm:p-12">
        <p className="text-sm font-bold uppercase tracking-wider text-emerald-700">
          Maroc Explorer
        </p>

        <h1 className="mt-3 text-3xl font-black text-slate-900 sm:text-4xl">
          Immobilier au Maroc
        </h1>

        <p className="mt-5 leading-7 text-slate-600">
          Cette rubrique est en préparation. Elle pourra accueillir des
          annonces de location, des biens à vendre et des informations
          immobilières par ville.
        </p>

        <p className="mt-4 text-sm leading-6 text-slate-500">
          Aucune annonce immobilière n'est affichée pour le moment, car
          aucune source de données immobilières n'a encore été configurée.
        </p>

        <Link
          href="/"
          className="mt-7 inline-flex rounded-xl bg-emerald-700 px-5 py-3 font-semibold text-white transition hover:bg-emerald-800"
        >
          Retour à l'accueil
        </Link>
      </div>
    </section>
  );
}
