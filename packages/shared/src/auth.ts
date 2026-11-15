import { z } from "zod";
import type { Utilisateur } from "./types";

export const classeSchema = z.enum(["6e", "5e", "4e", "3e"]);
export const matiereCodeSchema = z.enum(["MATHEMATIQUES", "PCT", "SVT"]);

export const inscriptionSchema = z.object({
  nom: z
    .string()
    .trim()
    .min(2, "Le nom doit contenir au moins 2 caractères.")
    .max(80, "Le nom est trop long."),
  email: z
    .string()
    .trim()
    .email("Indique une adresse email valide.")
    .max(160)
    .transform((email) => email.toLowerCase()),
  motDePasse: z
    .string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères.")
    .max(80, "Le mot de passe est trop long."),
  classe: classeSchema,
  matieres: z
    .array(matiereCodeSchema)
    .min(1, "Choisis au moins une matière.")
    .refine((codes) => new Set(codes).size === codes.length, "Une matière est répétée."),
});

export const connexionSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Indique une adresse email valide.")
    .transform((email) => email.toLowerCase()),
  motDePasse: z.string().min(1, "Indique ton mot de passe."),
});

export const reponseTriviaSchema = z.object({
  exerciceId: z.string().uuid("Question inconnue."),
  reponse: z.string().max(300),
});

export const reponseQcmSchema = reponseTriviaSchema;

export const reponseExerciceSchema = z.object({
  exerciceId: z.string().uuid("Question inconnue."),
  reponse: z
    .string()
    .trim()
    .min(2, "Écris une réponse d’au moins 2 caractères.")
    .max(2000, "Ta réponse est trop longue."),
});
export type ReponseTriviaInput = z.infer<typeof reponseTriviaSchema>;
export type ReponseQcmInput = ReponseTriviaInput;
export type ReponseExerciceInput = z.infer<typeof reponseExerciceSchema>;

export const correctionProfesseurSchema = z.object({
  correct: z.boolean(),
  commentaire: z.string().trim().max(500, "Le commentaire est trop long.").optional(),
});
export type CorrectionProfesseurInput = z.infer<typeof correctionProfesseurSchema>;
export type InscriptionInput = z.infer<typeof inscriptionSchema>;
export type ConnexionInput = z.infer<typeof connexionSchema>;

export interface AuthReponse {
  jeton: string;
  utilisateur: Utilisateur;
}
