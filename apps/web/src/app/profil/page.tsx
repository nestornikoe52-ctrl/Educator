"use client";

import {
  MATIERES,
  NIVEAUX,
  type ResultatOuvert,
  type ScoreHistorique,
  type TypeSession,
  type Utilisateur,
} from "@education-togo/shared";
import Link from "next/link";
import { useEffect, useState } from "react";
import { lireHistorique, lireMesCopies, lireProfil } from "@/lib/api";
import { profilLocal } from "@/lib/comptesLocaux";
import { lireFile, synchroniserFile } from "@/lib/horsLigne";
import { effacerJeton, lireJeton, urlApplication } from "@/lib/session";

const ACTIVITE: Record<TypeSession, string> = {
  exercices: "Exercices",
  qcm: "QCM",
  trivia: "Trivia",
};

function dateCourte(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "long" });
}

export default function ProfilPage() {
  const [profil, setProfil] = useState<Utilisateur | null>(null);
  const [scores, setScores] = useState<ScoreHistorique[]>([]);
  const [copies, setCopies] = useState<ResultatOuvert[]>([]);
  const [enAttente, setEnAttente] = useState(0);
  const [erreur, setErreur] = useState<string | null>(null);

  useEffect(() => {
    const jeton = lireJeton();
    if (!jeton) {
      window.location.href = urlApplication("/connexion/");
      return;
    }
    const local = profilLocal(jeton);
    if (local) {
      setProfil(local);
      setEnAttente(lireFile().length);
      return;
    }
    Promise.all([lireProfil(jeton), lireHistorique(jeton), lireMesCopies(jeton)])
      .then(([eleve, historique, resultats]) => {
        setProfil(eleve);
        setScores(historique);
        setCopies(resultats);
        setEnAttente(lireFile().length);
      })
      .catch(() => {
        effacerJeton();
        setErreur("Ta session a expiré. Reconnecte-toi.");
      });
  }, []);

  if (erreur) {
    return (
      <section className="max-w-3xl">
        <p className="text-muted">{erreur}</p>
        <Link href="/connexion" className="mt-4 inline-block text-green">
          Connexion
        </Link>
      </section>
    );
  }

  if (!profil) {
    return <p className="text-muted">Chargement du profil…</p>;
  }

  const classe = NIVEAUX.find((niveau) => niveau.code === profil.classe);

  return (
    <section className="max-w-3xl">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-green">Profil</p>
      <h1 className="mt-3 font-serif text-5xl text-ink">{profil.nom}</h1>
      <p className="mt-3 text-muted">{profil.email}</p>
      <p className="mt-8 text-sm uppercase tracking-[0.16em] text-muted">
        {profil.role === "professeur" ? "Rôle" : "Classe"}
      </p>
      <p className="mt-2 text-lg text-ink">
        {profil.role === "professeur"
          ? "Professeur"
          : classe
            ? `${classe.libelle} · ${classe.code}`
            : profil.classe}
      </p>
      {profil.role === "professeur" ? (
        <Link href="/professeur" className="mt-6 inline-block text-green">
          Lire les copies
        </Link>
      ) : null}
      <p className="mt-8 text-sm uppercase tracking-[0.16em] text-muted">Matières suivies</p>
      <ul className="mt-3 flex flex-wrap gap-2">
        {profil.matieres.map((code) => {
          const matiere = MATIERES.find((item) => item.code === code);
          return (
            <li key={code} className="rounded-full border border-line bg-card px-4 py-2 text-sm">
              {matiere?.nom ?? code}
            </li>
          );
        })}
      </ul>
      {profil.role === "eleve" ? (
        <>
          <p className="mt-8 text-sm uppercase tracking-[0.16em] text-muted">Résultats du professeur</p>
          {copies.length === 0 ? (
            <p className="mt-3 text-ink">Tes exercices corrigés apparaîtront ici.</p>
          ) : (
            <ul className="mt-3 grid gap-3">
              {copies.map((copie) => (
                <li key={copie.id} className="rounded-2xl border border-line bg-card px-4 py-3">
                  <p className="text-sm text-green">
                    {copie.chapitre.niveau.code} · {copie.chapitre.matiere.nom}
                  </p>
                  <p className="mt-1 text-ink">{copie.chapitre.titre}</p>
                  <p className="mt-2 text-sm text-ink">{copie.question}</p>
                  <p className="mt-2 whitespace-pre-wrap text-sm text-muted">{copie.reponse}</p>
                  <p className="mt-2 text-sm font-semibold text-ink">
                    {copie.revue
                      ? copie.correct
                        ? "Juste."
                        : "À retravailler."
                      : "En attente du professeur."}
                  </p>
                  {copie.revue && copie.commentaire ? (
                    <p className="mt-1 text-sm text-ink">{copie.commentaire}</p>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </>
      ) : null}
      <p className="mt-8 text-sm uppercase tracking-[0.16em] text-muted">Scores</p>
      {enAttente > 0 ? (
        <p className="mt-3 text-sm text-muted">
          {enAttente} partie{enAttente > 1 ? "s" : ""} en attente d’envoi.
        </p>
      ) : null}
      {scores.length === 0 ? (
        <p className="mt-3 text-ink">Tes parties terminées apparaîtront ici.</p>
      ) : (
        <ul className="mt-3 grid gap-3">
          {scores.map((partie) => (
            <li key={partie.id}>
              <Link
                href={`/chapitres/${partie.chapitre.id}`}
                className="flex items-center justify-between gap-4 rounded-2xl border border-line bg-card px-4 py-3"
              >
                <span>
                  <span className="block text-sm text-green">{ACTIVITE[partie.type]}</span>
                  <span className="mt-1 block text-ink">{partie.chapitre.titre}</span>
                  <span className="mt-1 block text-sm text-muted">
                    {partie.chapitre.niveau.code} · {partie.chapitre.matiere.nom} · {dateCourte(partie.fin)}
                  </span>
                </span>
                <span className="font-serif text-3xl text-ink">
                  {partie.type === "exercices"
                    ? `${partie.score} réponse${partie.score > 1 ? "s" : ""}`
                    : `${partie.score}/${partie.total}`}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
