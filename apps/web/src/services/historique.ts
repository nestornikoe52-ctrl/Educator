import type { EnTeteSujet } from "../export/entete";
import type { SujetGenere } from "./generer-exercices";

const CLE = "education-togo-sujets";

export type SujetEnregistre = {
  id: string;
  date: string;
  entete: EnTeteSujet;
  sujet: SujetGenere;
};

export function lireHistorique(): SujetEnregistre[] {
  if (typeof localStorage === "undefined") return [];
  try {
    const brut = localStorage.getItem(CLE);
    const valeur = brut ? (JSON.parse(brut) as SujetEnregistre[]) : [];
    return Array.isArray(valeur) ? valeur : [];
  } catch {
    return [];
  }
}

export function enregistrerSujet(sujet: SujetGenere, entete: EnTeteSujet) {
  const entree: SujetEnregistre = {
    id: crypto.randomUUID(),
    date: new Date().toISOString(),
    entete,
    sujet,
  };
  const suite = [entree, ...lireHistorique()].slice(0, 20);
  localStorage.setItem(CLE, JSON.stringify(suite));
  return suite;
}
