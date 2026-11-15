import progressions from "../data/progressions.json" with { type: "json" };

export const MATIERES_PROGRESSION = ["Mathématiques", "PCT", "SVT", "Technologie"] as const;
export const CLASSES_PROGRESSION = ["6e", "5e", "4e", "3e"] as const;

export type MatiereProgression = (typeof MATIERES_PROGRESSION)[number];
export type ClasseProgression = (typeof CLASSES_PROGRESSION)[number];
export type TypeSeance = "cours" | "integration_evaluation_remediation";

export type LeconProgression = {
  matiere: MatiereProgression;
  classe: ClasseProgression;
  theme: string;
  lecon: string;
  sous_titres: string[];
  volume_horaire: number;
  semaine: number;
  type_seance: TypeSeance;
};

const CLES = [
  "matiere",
  "classe",
  "theme",
  "lecon",
  "sous_titres",
  "volume_horaire",
  "semaine",
  "type_seance",
] as const;

export const PROGRESSIONS = progressions as LeconProgression[];

export function validerLecon(valeur: unknown): string[] {
  const erreurs: string[] = [];
  if (!valeur || typeof valeur !== "object") {
    return ["La leçon doit être un objet."];
  }
  const lecon = valeur as Record<string, unknown>;
  for (const cle of CLES) {
    if (!(cle in lecon)) erreurs.push(`Clé manquante : ${cle}.`);
  }
  if (!MATIERES_PROGRESSION.includes(lecon.matiere as MatiereProgression)) {
    erreurs.push("Matière inconnue.");
  }
  if (!CLASSES_PROGRESSION.includes(lecon.classe as ClasseProgression)) {
    erreurs.push("Classe inconnue.");
  }
  if (typeof lecon.theme !== "string" || !lecon.theme.trim()) erreurs.push("Thème vide.");
  if (typeof lecon.lecon !== "string" || !lecon.lecon.trim()) erreurs.push("Leçon vide.");
  if (!Array.isArray(lecon.sous_titres) || lecon.sous_titres.length === 0) {
    erreurs.push("Les sous-titres doivent former une liste non vide.");
  } else if (lecon.sous_titres.some((item) => typeof item !== "string" || !item.trim())) {
    erreurs.push("Chaque sous-titre doit être un texte.");
  }
  if (typeof lecon.volume_horaire !== "number" || lecon.volume_horaire < 0) {
    erreurs.push("Volume horaire invalide.");
  }
  if (typeof lecon.semaine !== "number" || lecon.semaine < 1) erreurs.push("Semaine invalide.");
  if (lecon.type_seance !== "cours" && lecon.type_seance !== "integration_evaluation_remediation") {
    erreurs.push("Type de séance invalide.");
  }
  return erreurs;
}

export function filtrerProgressions(
  source: LeconProgression[],
  filtre: { matiere?: string; classe?: string; lecons?: string[] },
) {
  return source.filter((item) => {
    if (filtre.matiere && item.matiere !== filtre.matiere) return false;
    if (filtre.classe && item.classe !== filtre.classe) return false;
    if (filtre.lecons && filtre.lecons.length > 0 && !filtre.lecons.includes(item.lecon)) return false;
    return true;
  });
}
