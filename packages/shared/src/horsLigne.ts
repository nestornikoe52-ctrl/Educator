import { z } from "zod";

export function reponseJuste(attendue: string, donnee: string) {
  const reponse = donnee.trim();
  return reponse.length > 0 && reponse === attendue.trim();
}

const reponseFileSchema = z.object({
  exerciceId: z.string().uuid(),
  reponse: z.string().max(300),
});

export const partieFileSchema = z.object({
  cleClient: z.string().uuid(),
  chapitreId: z.string().uuid(),
  type: z.enum(["qcm", "trivia"]),
  reponses: z.array(reponseFileSchema).min(1).max(40),
});

export const syncPartiesSchema = z.object({
  parties: z.array(partieFileSchema).min(1).max(20),
});

export type SyncPartiesInput = z.infer<typeof syncPartiesSchema>;
