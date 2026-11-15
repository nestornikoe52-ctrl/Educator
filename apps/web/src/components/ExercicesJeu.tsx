"use client";

import type { CorrectionExercice, PartieExercices } from "@education-togo/shared";
import Link from "next/link";
import { useEffect, useState } from "react";
import { commencerExercices, repondreExercice, terminerExercices } from "@/lib/api";
import { lireJeton } from "@/lib/session";

export function ExercicesJeu({ chapitreId }: { chapitreId: string }) {
  const [jeton, setJeton] = useState<string | null>(null);
  const [pret, setPret] = useState(false);
  const [partie, setPartie] = useState<PartieExercices | null>(null);
  const [index, setIndex] = useState(0);
  const [texte, setTexte] = useState("");
  const [correction, setCorrection] = useState<CorrectionExercice | null>(null);
  const [bilan, setBilan] = useState<{ score: number; total: number } | null>(null);
  const [erreur, setErreur] = useState<string | null>(null);
  const [envoi, setEnvoi] = useState(false);

  useEffect(() => {
    setJeton(lireJeton());
    setPret(true);
  }, []);

  const question = partie?.questions[index];

  async function lancer() {
    if (!jeton) {
      return;
    }
    setErreur(null);
    setBilan(null);
    setCorrection(null);
    setTexte("");
    setIndex(0);
    setPartie(null);
    try {
      setPartie(await commencerExercices(chapitreId, jeton));
    } catch (error: unknown) {
      setErreur(error instanceof Error ? error.message : "Les exercices n’ont pas pu démarrer.");
    }
  }

  async function envoyer() {
    if (!jeton || !partie || !question || envoi || correction) {
      return;
    }
    setEnvoi(true);
    setErreur(null);
    try {
      setCorrection(await repondreExercice(partie.sessionId, question.id, texte, jeton));
    } catch (error: unknown) {
      setErreur(error instanceof Error ? error.message : "La correction n’a pas été enregistrée.");
    } finally {
      setEnvoi(false);
    }
  }

  function continuer() {
    if (!correction || !partie || !jeton) {
      return;
    }
    if (correction.terminee || index + 1 >= partie.questions.length) {
      setBilan({ score: correction.score, total: correction.total });
      void terminerExercices(partie.sessionId, jeton).catch(() => undefined);
      return;
    }
    setCorrection(null);
    setTexte("");
    setIndex((valeur) => valeur + 1);
  }

  if (!pret) {
    return <p className="mt-8 text-muted">Préparation des exercices…</p>;
  }

  if (!jeton) {
    return (
      <p className="mt-8 text-lg text-ink">
        Connecte-toi pour garder tes réponses.{" "}
        <Link href="/connexion" className="text-green">
          Connexion
        </Link>
      </p>
    );
  }

  if (!partie) {
    return (
      <div className="mt-8">
        <button
          type="button"
          onClick={() => void lancer()}
          className="rounded-full bg-green-deep px-5 py-3 text-sm text-card"
        >
          Commencer
        </button>
        {erreur ? <p className="mt-4 text-sm text-[#8d2b1f]">{erreur}</p> : null}
      </div>
    );
  }

  if (bilan) {
    return (
      <div className="mt-8 rounded-3xl border border-line bg-card p-8 shadow-card">
        <p className="font-serif text-5xl text-ink">
          {bilan.score} réponse{bilan.score > 1 ? "s" : ""}
        </p>
        <p className="mt-3 text-lg text-ink">Tes réponses sont enregistrées. Le professeur pourra les lire.</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => void lancer()}
            className="rounded-full bg-green-deep px-5 py-3 text-sm text-card"
          >
            Recommencer
          </button>
          <Link href={`/chapitres/${chapitreId}`} className="rounded-full border border-line px-5 py-3 text-sm">
            Retour au résumé
          </Link>
        </div>
      </div>
    );
  }

  if (!question) {
    return null;
  }

  return (
    <div className="mt-8">
      <p className="text-sm text-muted">
        Exercice {index + 1} / {partie.questions.length}
      </p>
      <h2 className="mt-4 font-serif text-3xl leading-snug text-ink">{question.question}</h2>
      <textarea
        value={texte}
        onChange={(evenement) => setTexte(evenement.target.value)}
        disabled={Boolean(correction) || envoi}
        rows={5}
        placeholder="Écris ta réponse."
        className="mt-6 w-full rounded-2xl border border-line bg-card px-4 py-3 text-ink outline-none focus:border-green"
      />
      {correction ? (
        <div className="mt-5 rounded-2xl border border-line bg-card p-5">
          <p className="font-semibold text-ink">Réponse enregistrée.</p>
          <p className="mt-2 text-ink">{correction.feedback}</p>
          {correction.piste ? <p className="mt-3 text-ink">Piste : {correction.piste}</p> : null}
          <button
            type="button"
            onClick={continuer}
            className="mt-4 rounded-full bg-green-deep px-5 py-3 text-sm text-card"
          >
            {correction.terminee ? "Terminer" : "Exercice suivant"}
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => void envoyer()}
          disabled={envoi || texte.trim().length < 2}
          className="mt-4 rounded-full bg-green-deep px-5 py-3 text-sm text-card disabled:opacity-50"
        >
          {envoi ? "Enregistrement…" : "Envoyer"}
        </button>
      )}
      {erreur ? <p className="mt-4 text-sm text-[#8d2b1f]">{erreur}</p> : null}
    </div>
  );
}
