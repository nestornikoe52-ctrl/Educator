import type { Metadata } from "next";
import Link from "next/link";
import { CompteForm } from "@/components/CompteForm";

export const metadata: Metadata = {
  title: "Inscription · Éducation Togo",
};

export default function InscriptionPage() {
  return (
    <section className="max-w-xl">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-green">Compte élève</p>
      <h1 className="mt-3 font-serif text-5xl text-ink">Créer un compte</h1>
      <p className="mt-4 text-muted">
        Indique ton nom, ta classe et les matières que tu suis. Le mot de passe n’est pas
        conservé en clair.
      </p>
      <CompteForm mode="inscription" />
      <p className="mt-6 text-sm text-muted">
        Déjà inscrit ?{" "}
        <Link href="/connexion" className="text-green">
          Se connecter
        </Link>
      </p>
    </section>
  );
}
