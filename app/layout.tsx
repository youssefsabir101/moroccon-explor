
import type { Metadata } from "next";
import Navbar from "../components/Navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: "Maroc Explorer | Découvrez le Maroc",
  description:
    "Explorez le Maroc : tourisme, éducation, services et informations pratiques.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">
        <Navbar />
        <main>{children}</main>

        <footer className="mt-16 border-t border-slate-200 bg-white">
          <div className="mx-auto max-w-7xl px-5 py-8 text-sm text-slate-500">
            © 2026 Maroc Explorer · Tous droits réservés
          </div>
        </footer>
      </body>
    </html>
  );
}
