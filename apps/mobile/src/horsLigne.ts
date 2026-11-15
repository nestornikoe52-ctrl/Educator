import AsyncStorage from "@react-native-async-storage/async-storage";
import type { PackChapitre, PartieFile, QuestionHorsLigne } from "@education-togo/shared";
import { reponseJuste } from "@education-togo/shared";
import { synchroniserParties } from "./api";

const CLE_PACKS = "education-togo-packs";
const CLE_FILE = "education-togo-file";

async function lireJson<T>(cle: string, vide: T): Promise<T> {
  try {
    const brut = await AsyncStorage.getItem(cle);
    return brut ? (JSON.parse(brut) as T) : vide;
  } catch {
    return vide;
  }
}

export async function lirePack(chapitreId: string) {
  const packs = await lireJson<Record<string, PackChapitre>>(CLE_PACKS, {});
  return packs[chapitreId] ?? null;
}

export async function ecrirePack(pack: PackChapitre) {
  const packs = await lireJson<Record<string, PackChapitre>>(CLE_PACKS, {});
  packs[pack.chapitreId] = pack;
  await AsyncStorage.setItem(CLE_PACKS, JSON.stringify(packs));
}

export async function lireFile() {
  return lireJson<PartieFile[]>(CLE_FILE, []);
}

export async function ajouterPartie(partie: PartieFile) {
  const file = (await lireFile()).filter((item) => item.cleClient !== partie.cleClient);
  file.push(partie);
  await AsyncStorage.setItem(CLE_FILE, JSON.stringify(file));
}

export async function synchroniserFile(jeton: string) {
  const file = await lireFile();
  if (file.length === 0) {
    return;
  }
  const recu = await synchroniserParties(file, jeton);
  const parties = recu.resultats
    .filter((item) => item.statut === "creee" || item.statut === "deja")
    .map((item) => item.cleClient);
  const gardees = file.filter((partie) => !parties.includes(partie.cleClient));
  await AsyncStorage.setItem(CLE_FILE, JSON.stringify(gardees));
}

export function questionsLocales(questions: QuestionHorsLigne[]) {
  return {
    corrigee: new Map(questions.map((question) => [question.id, question])),
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
