import type { Metadata } from "next";
import Link from "next/link";
import { CompteForm } from "@/components/CompteForm";

export const metadata: Metadata = {
  title: "Connexion · Éducation Togo",
};

export default function ConnexionPage() {
  return (
    <section className="max-w-xl">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-green">Compte élève</p>
      <h1 className="mt-3 font-serif text-5xl text-ink">Connexion</h1>
      <p className="mt-4 text-muted">Reprends tes révisions avec l’email de ton compte.</p>
      <CompteForm mode="connexion" />
      <p className="mt-6 text-sm text-muted">
        Pas encore de compte ?{" "}
        <Link href="/inscription" className="text-green">
          S’inscrire
        </Link>
      </p>
    </section>
  );
}
