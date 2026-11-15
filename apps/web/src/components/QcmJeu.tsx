"use client";

import type { CorrectionQcm, PartieQcm, QuestionHorsLigne } from "@education-togo/shared";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { commencerQcm, repondreQcm, terminerQcm } from "@/lib/api";
import { ajouterPartie, lirePack, noterLocalement, questionsLocales, synchroniserFile } from "@/lib/horsLigne";
import { lireJeton } from "@/lib/session";

function phrase(score: number, total: number) {
  if (total > 0 && score === total) {
    return "Sans faute.";
  }
  if (total > 0 && score / total >= 0.6) {
    return "Bien joué.";
  }
  return "Relis le résumé du chapitre, puis recommence.";
}

export function QcmJeu({ chapitreId }: { chapitreId: string }) {
  const [jeton, setJeton] = useState<string | null>(null);
  const [pret, setPret] = useState(false);
  const [partie, setPartie] = useState<PartieQcm | null>(null);
  const [index, setIndex] = useState(0);
  const [correction, setCorrection] = useState<CorrectionQcm | null>(null);
  const [choixFait, setChoixFait] = useState<string | null>(null);
  const [bilan, setBilan] = useState<{ score: number; total: number } | null>(null);
  const [erreur, setErreur] = useState<string | null>(null);
  const [envoi, setEnvoi] = useState(false);
  const [horsLigne, setHorsLigne] = useState(false);
  const [packPret, setPackPret] = useState(false);
  const horsLigneRef = useRef(false);
  const corrigeeRef = useRef<Map<string, QuestionHorsLigne>>(new Map());
  const localesRef = useRef<{ exerciceId: string; reponse: string }[]>([]);

  useEffect(() => {
    setJeton(lireJeton());
    setPackPret(Boolean(lirePack(chapitreId)?.qcm.length));
    setPret(true);
  }, [chapitreId]);

  const question = partie?.questions[index];

  async function lancer() {
    if (!jeton) {
      return;
    }
    setErreur(null);
    setBilan(null);
    setCorrection(null);
    setChoixFait(null);
    setIndex(0);
    setPartie(null);
    horsLigneRef.current = false;
    setHorsLigne(false);
    localesRef.current = [];
    try {
      if (!navigator.onLine) {
        throw new Error("hors-ligne");
      }
      setPartie(await commencerQcm(chapitreId, jeton));
    } catch (error: unknown) {
      const pack = lirePack(chapitreId);
      if (!pack || pack.qcm.length === 0) {
        setErreur(
          error instanceof Error && error.message !== "hors-ligne"
            ? error.message
            : "Télécharge ce chapitre pendant que tu as du réseau.",
        );
        return;
      }
      const locales = questionsLocales(pack.qcm);
      corrigeeRef.current = locales.corrigee;
      horsLigneRef.current = true;
      setHorsLigne(true);
      setPartie({ sessionId: crypto.randomUUID(), questions: locales.questions });
    }
  }

  function jouerSansReseau() {
    const pack = lirePack(chapitreId);
    if (!pack || pack.qcm.length === 0) {
      setErreur("Télécharge ce chapitre pendant que tu as du réseau.");
      return;
    }
    const locales = questionsLocales(pack.qcm);
    corrigeeRef.current = locales.corrigee;
    horsLigneRef.current = true;
    localesRef.current = [];
    setHorsLigne(true);
    setErreur(null);
    setBilan(null);
    setCorrection(null);
    setChoixFait(null);
    setIndex(0);
    setPartie({ sessionId: crypto.randomUUID(), questions: locales.questions });
  }

  async function envoyer(reponse: string) {
    if (!jeton || !partie || !question || envoi || correction) {
      return;
    }
    setEnvoi(true);
    setChoixFait(reponse);
    if (horsLigneRef.current) {
      const note = noterLocalement(corrigeeRef.current, question.id, reponse);
      if (!note) {
        setEnvoi(false);
        return;
      }
      localesRef.current.push({ exerciceId: question.id, reponse });
      const score = localesRef.current.filter((item) =>
        noterLocalement(corrigeeRef.current, item.exerciceId, item.reponse)?.correct,
      ).length;
      setCorrection({
        ...note,
        score,
        total: partie.questions.length,
        terminee: localesRef.current.length >= partie.questions.length,
      });
      setEnvoi(false);
      return;
    }
    try {
      setCorrection(await repondreQcm(partie.sessionId, question.id, reponse, jeton));
    } catch (error: unknown) {
      setErreur(error instanceof Error ? error.message : "La réponse n’a pas été enregistrée.");
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
      if (horsLigneRef.current) {
        ajouterPartie({
          cleClient: partie.sessionId,
          chapitreId,
          type: "qcm",
          reponses: localesRef.current,
        });
        void synchroniserFile(jeton).catch(() => undefined);
        return;
      }
      void terminerQcm(partie.sessionId, jeton).catch(() => undefined);
      return;
    }
    setCorrection(null);
    setChoixFait(null);
    setIndex((valeur) => valeur + 1);
  }

  if (!pret) {
    return <p className="mt-8 text-muted">Préparation du QCM…</p>;
  }

  if (!jeton) {
    return (
      <p className="mt-8 text-lg text-ink">
        Connecte-toi pour garder ton score.{" "}
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
        {packPret ? (
          <button
            type="button"
            onClick={jouerSansReseau}
            className="ml-3 rounded-full border border-green px-5 py-3 text-sm text-green"
          >
            Jouer sans réseau
          </button>
        ) : null}
        {erreur ? <p className="mt-4 text-sm text-[#8d2b1f]">{erreur}</p> : null}
      </div>
    );
  }

  if (bilan) {
    return (
      <div className="mt-8 rounded-3xl border border-line bg-card p-8 shadow-card">
        <p className="font-serif text-5xl text-ink">
          {bilan.score}/{bilan.total}
        </p>
        <p className="mt-3 text-lg text-ink">{phrase(bilan.score, bilan.total)}</p>
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
      {horsLigne ? (
        <p className="mb-4 text-sm text-muted">Hors ligne. Le score partira dès que le réseau revient.</p>
      ) : null}
      <p className="text-sm text-muted">
        Question {index + 1} / {partie.questions.length}
      </p>
      <h2 className="mt-4 font-serif text-3xl leading-snug text-ink">{question.question}</h2>
      <ul className="mt-6 grid gap-3">
        {question.choixPossibles.map((choix) => {
          const bonne = correction?.bonneReponse === choix;
          const mauvaise = Boolean(correction) && choixFait === choix && !bonne;
          const classe = correction
            ? bonne
              ? "border-green bg-green text-card"
              : mauvaise
                ? "border-[#8d2b1f] text-[#8d2b1f]"
                : "border-line text-muted"
            : "border-line bg-card text-ink hover:border-green";
          return (
            <li key={choix}>
              <button
                type="button"
                disabled={Boolean(correction) || envoi}
                onClick={() => void envoyer(choix)}
                className={`w-full rounded-2xl border px-4 py-3 text-left ${classe}`}
              >
                {choix}
              </button>
            </li>
          );
        })}
      </ul>
      {correction ? (
        <div className="mt-5">
          <p className="text-ink">
            {correction.correct ? "Bonne réponse." : "Pas cette fois."} {correction.explication}
          </p>
          <button
            type="button"
            onClick={continuer}
            className="mt-4 rounded-full bg-green-deep px-5 py-3 text-sm text-card"
          >
            {correction.terminee ? "Voir le score" : "Question suivante"}
          </button>
        </div>
      ) : null}
      {erreur ? <p className="mt-4 text-sm text-[#8d2b1f]">{erreur}</p> : null}
    </div>
  );
}
