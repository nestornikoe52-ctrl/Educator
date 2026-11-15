import type { MatiereCode, NiveauCode } from "./curriculum";

export type TypeExercice = "ouverte" | "qcm" | "trivia";
export type TypeSession = "exercices" | "qcm" | "trivia";
export type RoleUtilisateur = "eleve" | "professeur";

export interface Utilisateur {
  id: string;
  nom: string;
  email: string;
  role: RoleUtilisateur;
  classe: NiveauCode | null;
  matieres: MatiereCode[];
}

export interface Niveau {
  id: string;
  code: NiveauCode;
  libelle: string;
  ordre: number;
}

export interface Matiere {
  id: string;
  code: MatiereCode;
  nom: string;
}

export interface Chapitre {
  id: string;
  titre: string;
  ordre: number;
  niveauId: string;
  matiereId: string;
  resumeCours: string;
}

export interface ChapitrePublie {
  id: string;
  titre: string;
  ordre: number;
  resumeCours: string;
  niveau: Pick<Niveau, "code" | "libelle">;
  matiere: Pick<Matiere, "code" | "nom">;
}

export interface Exercice {
  id: string;
  chapitreId: string;
  ordre: number;
  question: string;
  type: TypeExercice;
  choixPossibles: string[];
  bonneReponse: string;
  explication: string | null;
  dureeSecondes: number | null;
}

export interface Session {
  id: string;
  userId: string;
  chapitreId: string;
  type: TypeSession;
  score: number;
  total: number;
  debut: string;
  fin: string | null;
}

export interface QuestionTrivia {
  id: string;
  ordre: number;
  question: string;
  choixPossibles: string[];
  dureeSecondes: number;
}

export interface PartieTrivia {
  sessionId: string;
  questions: QuestionTrivia[];
}

export interface CorrectionTrivia {
  correct: boolean;
  bonneReponse: string;
  explication: string | null;
  score: number;
  total: number;
  terminee: boolean;
}

export interface BilanTrivia {
  score: number;
  total: number;
}

export interface QuestionQcm {
  id: string;
  ordre: number;
  question: string;
  choixPossibles: string[];
}

export interface PartieQcm {
  sessionId: string;
  questions: QuestionQcm[];
}

export type CorrectionQcm = CorrectionTrivia;
export type BilanQcm = BilanTrivia;

export interface QuestionOuverte {
  id: string;
  ordre: number;
  question: string;
}

export interface PartieExercices {
  sessionId: string;
  questions: QuestionOuverte[];
}

export interface CorrectionExercice {
  correct: boolean;
  feedback: string;
  piste: string | null;
  score: number;
  total: number;
  terminee: boolean;
}

export type BilanExercices = BilanTrivia;

export interface QuestionHorsLigne {
  id: string;
  ordre: number;
  question: string;
  choixPossibles: string[];
  dureeSecondes: number | null;
  bonneReponse: string;
  explication: string | null;
}

export interface PackChapitre {
  chapitreId: string;
  titre: string;
  niveauCode: string;
  matiereNom: string;
  trivia: QuestionHorsLigne[];
  qcm: QuestionHorsLigne[];
}

export interface ReponseFile {
  exerciceId: string;
  reponse: string;
}

export interface PartieFile {
  cleClient: string;
  chapitreId: string;
  type: "qcm" | "trivia";
  reponses: ReponseFile[];
}

export interface ResultatSync {
  cleClient: string;
  score: number;
  total: number;
  statut: "creee" | "deja" | "ignoree";
}

export interface CopieEleve {
  id: string;
  date: string;
  eleve: { nom: string; classe: NiveauCode | null };
  chapitre: {
    id: string;
    titre: string;
    niveau: { code: NiveauCode; libelle: string };
    matiere: { code: MatiereCode; nom: string };
  };
  question: string;
  reponse: string;
  piste: string | null;
  critere: string;
  revue: boolean;
  correct: boolean;
  commentaire: string | null;
}

export interface ResultatOuvert {
  id: string;
  date: string;
  revue: boolean;
  correct: boolean;
  commentaire: string | null;
  chapitre: CopieEleve["chapitre"];
  question: string;
  reponse: string;
  piste: string | null;
}

export interface ScoreHistorique {
  id: string;
  type: TypeSession;
  score: number;
  total: number;
  fin: string;
  chapitre: {
    id: string;
    titre: string;
    niveau: { code: NiveauCode; libelle: string };
    matiere: { code: MatiereCode; nom: string };
  };
}

export interface Resultat {
  id: string;
  userId: string;
  exerciceId: string;
  sessionId: string | null;
  reponseDonnee: string;
  correct: boolean;
  feedback: string | null;
  date: string;
}
