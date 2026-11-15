export const NIVEAUX = [
  { code: "6e", libelle: "Sixième", ordre: 1 },
  { code: "5e", libelle: "Cinquième", ordre: 2 },
  { code: "4e", libelle: "Quatrième", ordre: 3 },
  { code: "3e", libelle: "Troisième", ordre: 4 },
] as const;

export const MATIERES = [
  {
    code: "MATHEMATIQUES",
    nom: "Mathématiques",
    court: "Maths",
    description: "Nombres, géométrie, calcul et raisonnement.",
  },
  {
    code: "PCT",
    nom: "Physique-Chimie-Technologie",
    court: "PCT",
    description: "Matière, énergie, phénomènes et technologie.",
  },
  {
    code: "SVT",
    nom: "Sciences de la Vie et de la Terre",
    court: "SVT",
    description: "Le vivant, le corps humain et la Terre.",
  },
] as const;

export const PARCOURS = ["Niveau", "Matière", "Chapitre"] as const;

export const ACTIVITES = [
  { code: "resume", nom: "Résumé de cours" },
  { code: "exercices", nom: "Exercices" },
  { code: "qcm", nom: "QCM" },
  { code: "trivia", nom: "Trivia" },
] as const;

export const CREATEUR = {
  nom: "M. Nikoe Nestor",
  titre: "Professeur de SVT, de Mathématiques et de PCT",
  presentation:
    "Cette application a été créée par M. Nikoe Nestor, professeur de Sciences de la Vie et de la Terre (SVT), de Mathématiques et de PCT (Physique-Chimie-Technologie), pour aider les élèves du collège togolais à réviser selon l'Approche Par Compétences.",
} as const;

export type NiveauCode = (typeof NIVEAUX)[number]["code"];
export type MatiereCode = (typeof MATIERES)[number]["code"];
export type ActiviteCode = (typeof ACTIVITES)[number]["code"];
