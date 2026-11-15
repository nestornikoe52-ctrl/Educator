import { reponseJuste, type PackChapitre, type PartieFile, type QuestionHorsLigne } from "@education-togo/shared";
import { synchroniserParties } from "@/lib/api";

const CLE_PACKS = "education-togo-packs";
const CLE_FILE = "education-togo-file";

function lireJson<T>(cle: string, vide: T): T {
  if (typeof window === "undefined") {
    return vide;
  }
  try {
    const brut = localStorage.getItem(cle);
    return brut ? (JSON.parse(brut) as T) : vide;
  } catch {
    return vide;
  }
}

export function lirePack(chapitreId: string) {
  return lireJson<Record<string, PackChapitre>>(CLE_PACKS, {})[chapitreId] ?? null;
}

export function ecrirePack(pack: PackChapitre) {
  const packs = lireJson<Record<string, PackChapitre>>(CLE_PACKS, {});
  packs[pack.chapitreId] = pack;
  localStorage.setItem(CLE_PACKS, JSON.stringify(packs));
}

export function lireFile() {
  return lireJson<PartieFile[]>(CLE_FILE, []);
}

export function ajouterPartie(partie: PartieFile) {
  const file = lireFile().filter((item) => item.cleClient !== partie.cleClient);
  file.push(partie);
  localStorage.setItem(CLE_FILE, JSON.stringify(file));
}

export function retirerParties(cles: string[]) {
  const gardees = lireFile().filter((partie) => !cles.includes(partie.cleClient));
  localStorage.setItem(CLE_FILE, JSON.stringify(gardees));
}

export async function synchroniserFile(jeton: string) {
  const file = lireFile();
  if (file.length === 0 || (typeof navigator !== "undefined" && !navigator.onLine)) {
    return;
  }
  const recu = await synchroniserParties(file, jeton);
  retirerParties(
    recu.resultats.filter((item) => item.statut === "creee" || item.statut === "deja").map((item) => item.cleClient),
  );
}

export function questionsLocales(questions: QuestionHorsLigne[]) {
  const corrigee = new Map(questions.map((question) => [question.id, question]));
  return {
    corrigee,
    questions: questions.map((question) => ({
      id: question.id,
      ordre: question.ordre,
      question: question.question,
      choixPossibles: question.choixPossibles,
      dureeSecondes: question.dureeSecondes ?? 20,
    })),
  };
}

export function noterLocalement(corrigee: Map<string, QuestionHorsLigne>, exerciceId: string, reponse: string) {
  const question = corrigee.get(exerciceId);
  if (!question) {
    return null;
  }
  return {
    correct: reponseJuste(question.bonneReponse, reponse),
    bonneReponse: question.bonneReponse,
    explication: question.explication,
  };
}
