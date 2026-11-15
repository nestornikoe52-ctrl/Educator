import type { Metadata } from "next";
import { CREATEUR } from "@education-togo/shared";

export const metadata: Metadata = {
  title: "À propos · Éducation Togo",
};

export default function AboutPage() {
  return (
    <article className="max-w-2xl">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-green">À propos</p>
      <h1 className="mt-3 font-serif text-5xl leading-tight text-ink">{CREATEUR.nom}</h1>
      <p className="mt-3 text-lg text-muted">{CREATEUR.titre}</p>
      <p className="mt-8 text-lg leading-relaxed text-ink">{CREATEUR.presentation}</p>
      <p className="mt-6 leading-relaxed text-muted">
        L&apos;application couvre pour l&apos;instant le collège, de la 6e à la 3e, en
        Mathématiques, PCT et SVT. Le parcours d&apos;un chapitre reste le même : lire le
        résumé, puis s&apos;entraîner avec des exercices, des QCM et un trivia.
      </p>
    </article>
  );
}
