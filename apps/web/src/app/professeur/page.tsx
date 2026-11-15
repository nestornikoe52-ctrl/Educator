"use client";

import { NIVEAUX, type CopieEleve } from "@education-togo/shared";
import Link from "next/link";
import { useEffect, useState } from "react";
import { corrigerCopie, lireCopies } from "@/lib/api";
import { lireJeton } from "@/lib/session";

function dateCourte(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function ProfesseurPage() {
  const [copies, setCopies] = useState<CopieEleve[] | null>(null);
  const [erreur, setErreur] = useState<string | null>(null);
  const [envoi, setEnvoi] = useState<string | null>(null);

  async function noter(copieId: string, correct: boolean) {
    const jeton = lireJeton();
    if (!jeton || envoi) {
      return;
    }
    setEnvoi(copieId);
    setErreur(null);
    try {
      const copie = await corrigerCopie(copieId, correct, jeton);
      setCopies((liste) => liste?.map((item) => (item.id === copie.id ? copie : item)) ?? null);
    } catch (error: unknown) {
      setErreur(error instanceof Error ? error.message : "La correction n’a pas été enregistrée.");
    } finally {
      setEnvoi(null);
    }
  }

  useEffect(() => {
    const jeton = lireJeton();
    if (!jeton) {
      setErreur("Connecte-toi avec le compte du professeur.");
      return;
    }
    lireCopies(jeton)
      .then(setCopies)
      .catch((error: unknown) => {
        setErreur(error instanceof Error ? error.message : "Les copies n’ont pas pu être lues.");
      });
  }, []);

  return (
    <section className="max-w-3xl">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-green">Professeur</p>
      <h1 className="mt-3 font-serif text-5xl text-ink">Copies</h1>
      <p className="mt-3 text-muted">Les réponses ouvertes des élèves, les plus récentes en premier.</p>
      {erreur ? (
        <p className="mt-8 text-ink">
          {erreur}{" "}
          {erreur.startsWith("Connecte-toi") ? (
            <Link href="/connexion" className="text-green">
              Connexion
            </Link>
          ) : null}
        </p>
      ) : null}
      {copies && copies.length === 0 ? (
        <p className="mt-8 text-ink">Aucune réponse d’exercice pour le moment.</p>
      ) : null}
      {copies && copies.length > 0 ? (
        <ul className="mt-8 grid gap-4">
          {copies.map((copie) => {
            const classe = NIVEAUX.find((niveau) => niveau.code === copie.eleve.classe);
            return (
              <li key={copie.id} className="rounded-3xl border border-line bg-card p-5 shadow-card">
                <p className="text-sm text-green">
                  {copie.eleve.nom}
                  {classe ? ` · ${classe.libelle}` : ""}
                </p>
                <p className="mt-2 font-serif text-2xl text-ink">{copie.chapitre.titre}</p>
                <p className="mt-1 text-sm text-muted">
                  {copie.chapitre.niveau.code} · {copie.chapitre.matiere.nom} · {dateCourte(copie.date)}
                </p>
                <p className="mt-4 text-ink">{copie.question}</p>
                <p className="mt-3 whitespace-pre-wrap rounded-2xl bg-paper px-4 py-3 text-ink">{copie.reponse}</p>
                <p className="mt-3 text-sm text-muted">Piste : {copie.piste ?? "Aucune piste."}</p>
                <p className="mt-2 text-sm text-muted">Critère : {copie.critere}</p>
                {copie.revue ? (
                  <p className="mt-3 text-sm text-ink">
                    {copie.correct ? "Marquée juste." : "Marquée à retravailler."} L’élève voit ce résultat.
                  </p>
                ) : (
                  <p className="mt-3 text-sm text-muted">Pas encore rendue à l’élève.</p>
                )}
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    type="button"
                    disabled={envoi === copie.id}
                    onClick={() => void noter(copie.id, true)}
                    className={`rounded-full px-4 py-2 text-sm ${
                      copie.revue && copie.correct ? "bg-green text-card" : "border border-line bg-card text-ink"
                    }`}
                  >
                    Juste
                  </button>
                  <button
                    type="button"
                    disabled={envoi === copie.id}
                    onClick={() => void noter(copie.id, false)}
                    className={`rounded-full px-4 py-2 text-sm ${
                      copie.revue && !copie.correct
                        ? "bg-[#8d2b1f] text-card"
                        : "border border-line bg-card text-ink"
                    }`}
                  >
                    À retravailler
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      ) : null}
      {!erreur && !copies ? <p className="mt-8 text-muted">Chargement des copies…</p> : null}
    </section>
  );
}
