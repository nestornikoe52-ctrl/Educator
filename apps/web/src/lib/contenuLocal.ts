import type { PackChapitre, QuestionHorsLigne } from "@education-togo/shared";
import { EXERCICES_OUVERTS } from "../../../api/prisma/exercices";
import { QUESTIONS_QCM } from "../../../api/prisma/qcm";
import { QUESTIONS_TRIVIA } from "../../../api/prisma/trivia";

function identite(chapitreId: string) {
  const trouve = /^(6e|5e|4e|3e)-(MATHEMATIQUES|PCT|SVT)-(\d+)$/.exec(chapitreId);
  if (!trouve) {
    return null;
  }
  return {
    niveau: trouve[1] as "6e" | "5e" | "4e" | "3e",
    matiere: trouve[2] as "MATHEMATIQUES" | "PCT" | "SVT",
    ordre: Number(trouve[3]),
  };
}

function versQuestion(
  question: { question: string; choix: readonly string[]; bonneReponse: string; explication: string },
  index: number,
  duree: number | null,
): QuestionHorsLigne {
  return {
    id: `local-${index + 1}`,
    ordre: index + 1,
    question: question.question,
    choixPossibles: [...question.choix],
    dureeSecondes: duree,
    bonneReponse: question.bonneReponse,
    explication: question.explication,
  };
}

export function packIntegre(chapitreId: string): PackChapitre | null {
  const id = identite(chapitreId);
  if (!id) {
    return null;
  }
  const filtre = { niveau: id.niveau, matiere: id.matiere, chapitreOrdre: id.ordre };
  const qcm = QUESTIONS_QCM.filter(
    (question) =>
      question.niveau === filtre.niveau &&
      question.matiere === filtre.matiere &&
      question.chapitreOrdre === filtre.chapitreOrdre,
  ).map((question, index) => versQuestion(question, index, null));
  const trivia = QUESTIONS_TRIVIA.filter(
    (question) =>
      question.niveau === filtre.niveau &&
      question.matiere === filtre.matiere &&
      question.chapitreOrdre === filtre.chapitreOrdre,
  ).map((question, index) => versQuestion(question, index, 20));
  if (qcm.length === 0 && trivia.length === 0) {
    return null;
  }
  return {
    chapitreId,
    titre: "",
    niveauCode: id.niveau,
    matiereNom: id.matiere,
    qcm,
    trivia,
  };
}

export function exercicesIntegres(chapitreId: string) {
  const id = identite(chapitreId);
  if (!id) {
    return [];
  }
  return EXERCICES_OUVERTS.filter(
    (exercice) =>
      exercice.niveau === id.niveau &&
      exercice.matiere === id.matiere &&
      exercice.chapitreOrdre === id.ordre,
  ).map((exercice, index) => ({
    id: `local-${index + 1}`,
    ordre: index + 1,
    question: exercice.question,
    piste: exercice.piste,
  }));
}
