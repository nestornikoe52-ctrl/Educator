"use client";

import type { CorrectionTrivia, PartieTrivia, QuestionHorsLigne } from "@education-togo/shared";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { commencerTrivia, repondreTrivia, terminerTrivia } from "@/lib/api";
import { packIntegre } from "@/lib/contenuLocal";
import { ajouterPartie, lirePack, noterLocalement, questionsLocales, synchroniserFile } from "@/lib/horsLigne";
import { lireJeton } from "@/lib/session";

function phrase(score: number, total: number) {
  if (total > 0 && score === total) {
    return "Sans faute.";
  }
  if (total > 0 && score / total >= 0.6) {
    return "Bien joué.";
  }
  return "Relis le résumé du chapitre, puis rejoue.";
}

export function TriviaJeu({ chapitreId }: { chapitreId: string }) {
  const [jeton, setJeton] = useState<string | null>(null);
  const [pret, setPret] = useState(false);
  const [partie, setPartie] = useState<PartieTrivia | null>(null);
  const [index, setIndex] = useState(0);
  const [reste, setReste] = useState(0);
  const [correction, setCorrection] = useState<CorrectionTrivia | null>(null);
  const [bilan, setBilan] = useState<{ score: number; total: number } | null>(null);
  const [erreur, setErreur] = useState<string | null>(null);
  const [envoi, setEnvoi] = useState(false);
  const [horsLigne, setHorsLigne] = useState(false);
  const [packPret, setPackPret] = useState(false);
  const envoiRef = useRef(false);
  const echeanceRef = useRef<number | null>(null);
  const horsLigneRef = useRef(false);
  const corrigeeRef = useRef<Map<string, QuestionHorsLigne>>(new Map());
  const localesRef = useRef<{ exerciceId: string; reponse: string }[]>([]);

  useEffect(() => {
    setJeton(lireJeton());
    setPackPret(Boolean((lirePack(chapitreId) ?? packIntegre(chapitreId))?.trivia.length));
    setPret(true);
  }, [chapitreId]);

  const question = partie?.questions[index];

  useEffect(() => {
    if (!question || correction || bilan) {
      return;
    }
    echeanceRef.current = Date.now() + question.dureeSecondes * 1000;
    setReste(question.dureeSecondes);
    const minuteur = window.setInterval(() => {
      const echeance = echeanceRef.current ?? Date.now();
      setReste(Math.max(0, Math.ceil((echeance - Date.now()) / 1000)));
    }, 250);
    return () => window.clearInterval(minuteur);
  }, [question, correction, bilan]);

  useEffect(() => {
    if (!question || correction || bilan || reste > 0 || envoiRef.current) {
      return;
    }
    const echeance = echeanceRef.current;
    if (echeance === null || Date.now() < echeance) {
      return;
    }
    void envoyer("");
  }, [reste, question, correction, bilan]);

  async function lancer() {
    setErreur(null);
    setBilan(null);
    setCorrection(null);
    setIndex(0);
    setPartie(null);
    horsLigneRef.current = false;
    setHorsLigne(false);
    localesRef.current = [];
    try {
      if (!jeton || !navigator.onLine) {
        throw new Error("hors-ligne");
      }
      const suivante = await commencerTrivia(chapitreId, jeton);
      setPartie(suivante);
    } catch (error: unknown) {
      const pack = lirePack(chapitreId) ?? packIntegre(chapitreId);
      if (!pack || pack.trivia.length === 0) {
        setErreur(
          error instanceof Error && error.message !== "hors-ligne"
            ? error.message
            : "Ce chapitre n’a pas encore de questions.",
        );
        return;
      }
      const locales = questionsLocales(pack.trivia);
      corrigeeRef.current = locales.corrigee;
      horsLigneRef.current = true;
      setHorsLigne(true);
      setPartie({ sessionId: crypto.randomUUID(), questions: locales.questions });
    }
  }

  function jouerSansReseau() {
    const pack = lirePack(chapitreId) ?? packIntegre(chapitreId);
    if (!pack || pack.trivia.length === 0) {
      setErreur("Ce chapitre n’a pas encore de questions.");
      return;
    }
    const locales = questionsLocales(pack.trivia);
    corrigeeRef.current = locales.corrigee;
    horsLigneRef.current = true;
    localesRef.current = [];
    setHorsLigne(true);
    setErreur(null);
    setBilan(null);
    setCorrection(null);
    setIndex(0);
    setPartie({ sessionId: crypto.randomUUID(), questions: locales.questions });
  }

  async function envoyer(reponse: string) {
    if (!partie || !question || envoiRef.current || correction) {
      return;
    }
    envoiRef.current = true;
    setEnvoi(true);
    if (horsLigneRef.current) {
      const note = noterLocalement(corrigeeRef.current, question.id, reponse);
      if (!note) {
        envoiRef.current = false;
        setEnvoi(false);
        return;
      }
      localesRef.current.push({ exerciceId: question.id, reponse });
      const score = localesRef.current.filter((item) => {
        const attendue = corrigeeRef.current.get(item.exerciceId);
        return attendue ? noterLocalement(corrigeeRef.current, item.exerciceId, item.reponse)?.correct : false;
      }).length;
      const resultat = {
        ...note,
        score,
        total: partie.questions.length,
        terminee: localesRef.current.length >= partie.questions.length,
      };
      setCorrection(resultat);
      window.setTimeout(() => {
        envoiRef.current = false;
        setEnvoi(false);
        setCorrection(null);
        if (resultat.terminee) {
          setBilan({ score: resultat.score, total: resultat.total });
          if (jeton) {
            ajouterPartie({
              cleClient: partie.sessionId,
              chapitreId,
              type: "trivia",
              reponses: localesRef.current,
            });
            void synchroniserFile(jeton).catch(() => undefined);
          }
          return;
        }
        setIndex((valeur) => valeur + 1);
      }, 1400);
      return;
    }
    try {
      if (!jeton) {
        throw new Error("hors-ligne");
      }
      const resultat = await repondreTrivia(partie.sessionId, question.id, reponse, jeton);
      setCorrection(resultat);
      window.setTimeout(() => {
        envoiRef.current = false;
        setEnvoi(false);
        setCorrection(null);
        if (resultat.terminee || index + 1 >= partie.questions.length) {
          setBilan({ score: resultat.score, total: resultat.total });
          void terminerTrivia(partie.sessionId, jeton).catch(() => undefined);
          return;
        }
        setIndex((valeur) => valeur + 1);
      }, 1400);
    } catch (error: unknown) {
      envoiRef.current = false;
      setEnvoi(false);
      setErreur(error instanceof Error ? error.message : "La réponse n’a pas été enregistrée.");
    }
  }

  if (!pret) {
    return <p className="mt-8 text-muted">Préparation de la partie…</p>;
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
            Rejouer
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
      <div className="flex items-center justify-between text-sm text-muted">
        <span>
          Question {index + 1} / {partie.questions.length}
        </span>
        <span className="font-semibold text-ink">{reste} s</span>
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-line">
        <div
          className="h-full bg-gold"
          style={{ width: `${(reste / question.dureeSecondes) * 100}%` }}
        />
      </div>
      <h2 className="mt-6 font-serif text-3xl leading-snug text-ink">{question.question}</h2>
      <ul className="mt-6 grid gap-3">
        {question.choixPossibles.map((choix) => {
          const bonne = correction?.bonneReponse === choix;
          const classe = correction
            ? bonne
              ? "border-green bg-green text-card"
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
        <p className="mt-5 text-ink">
          {correction.correct ? "Bonne réponse." : "Pas cette fois."} {correction.explication}
        </p>
      ) : null}
      {erreur ? <p className="mt-4 text-sm text-[#8d2b1f]">{erreur}</p> : null}
    </div>
  );
}
