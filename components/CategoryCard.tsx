
import Link from "next/link";

interface CategoryCardProps {
  title: string;
  description: string;
  href: string;
  icon: string;
}

export default function CategoryCard({
  title,
  description,
  href,
  icon,
}: CategoryCardProps) {
  return (
    <Link
      href={href}
      className="group rounded-2xl border border-slate-200 bg-white p-6 transition duration-200 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-lg"
    >
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-2xl">
        {icon}
      </div>

      <h2 className="mb-2 text-lg font-bold text-slate-900 group-hover:text-emerald-800">
        {title}
      </h2>

      <p className="text-sm leading-6 text-slate-600">
        {description}
      </p>

      <span className="mt-5 inline-block text-sm font-semibold text-emerald-700">
        Découvrir →
      </span>
    </Link>
  );
}
