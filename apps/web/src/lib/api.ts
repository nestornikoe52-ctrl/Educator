import type {
  AuthReponse,
  BilanExercices,
  BilanQcm,
  BilanTrivia,
  ChapitrePublie,
  CopieEleve,
  CorrectionExercice,
  CorrectionQcm,
  CorrectionTrivia,
  PackChapitre,
  PartieExercices,
  PartieFile,
  PartieQcm,
  PartieTrivia,
  ResultatSync,
  ResultatOuvert,
  ScoreHistorique,
  Utilisateur,
} from "@education-togo/shared";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api";

export async function api<T>(chemin: string, options: RequestInit = {}, jeton?: string | null) {
  const headers = new Headers(options.headers);
  if (options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  if (jeton) {
    headers.set("Authorization", `Bearer ${jeton}`);
  }

  const reponse = await fetch(`${API_URL}${chemin}`, { ...options, headers });
  const corps = (await reponse.json().catch(() => ({}))) as { message?: string | string[] };

  if (!reponse.ok) {
    const message = Array.isArray(corps.message) ? corps.message[0] : corps.message;
    throw new Error(message ?? "La requête a échoué.");
  }

  return corps as T;
}

export function inscrire(corps: unknown) {
  return api<AuthReponse>("/auth/inscription", {
    method: "POST",
    body: JSON.stringify(corps),
  });
}

export function connecter(corps: unknown) {
  return api<AuthReponse>("/auth/connexion", {
    method: "POST",
    body: JSON.stringify(corps),
  });
}

export function lireProfil(jeton: string) {
  return api<Utilisateur>("/auth/moi", {}, jeton);
}

export function lireHistorique(jeton: string) {
  return api<ScoreHistorique[]>("/auth/historique", {}, jeton);
}

export function lireCopies(jeton: string) {
  return api<CopieEleve[]>("/professeur/copies", {}, jeton);
}

export function corrigerCopie(copieId: string, correct: boolean, jeton: string, commentaire?: string) {
  return api<CopieEleve>(
    `/professeur/copies/${copieId}`,
    { method: "PATCH", body: JSON.stringify({ correct, commentaire }) },
    jeton,
  );
}

export function lireMesCopies(jeton: string) {
  return api<ResultatOuvert[]>("/exercices/copies", {}, jeton);
}

export function listerChapitres(niveau: string, matiere: string) {
  const parametres = new URLSearchParams({ niveau, matiere });
  return api<ChapitrePublie[]>(`/chapitres?${parametres.toString()}`, { cache: "no-store" });
}

export function lireChapitre(id: string) {
  return api<ChapitrePublie>(`/chapitres/${id}`, { cache: "no-store" });
}

export function commencerTrivia(chapitreId: string, jeton: string) {
  return api<PartieTrivia>(`/chapitres/${chapitreId}/trivia`, { method: "POST" }, jeton);
}

export function repondreTrivia(
  sessionId: string,
  exerciceId: string,
  reponse: string,
  jeton: string,
) {
  return api<CorrectionTrivia>(
    `/trivia/${sessionId}/reponses`,
    { method: "POST", body: JSON.stringify({ exerciceId, reponse }) },
    jeton,
  );
}

export function terminerTrivia(sessionId: string, jeton: string) {
  return api<BilanTrivia>(`/trivia/${sessionId}/terminer`, { method: "POST" }, jeton);
}

export function commencerQcm(chapitreId: string, jeton: string) {
  return api<PartieQcm>(`/chapitres/${chapitreId}/qcm`, { method: "POST" }, jeton);
}

export function repondreQcm(sessionId: string, exerciceId: string, reponse: string, jeton: string) {
  return api<CorrectionQcm>(
    `/qcm/${sessionId}/reponses`,
    { method: "POST", body: JSON.stringify({ exerciceId, reponse }) },
    jeton,
  );
}

export function terminerQcm(sessionId: string, jeton: string) {
  return api<BilanQcm>(`/qcm/${sessionId}/terminer`, { method: "POST" }, jeton);
}

export function commencerExercices(chapitreId: string, jeton: string) {
  return api<PartieExercices>(`/chapitres/${chapitreId}/exercices`, { method: "POST" }, jeton);
}

export function repondreExercice(sessionId: string, exerciceId: string, reponse: string, jeton: string) {
  return api<CorrectionExercice>(
    `/exercices/${sessionId}/reponses`,
    { method: "POST", body: JSON.stringify({ exerciceId, reponse }) },
    jeton,
  );
}

export function terminerExercices(sessionId: string, jeton: string) {
  return api<BilanExercices>(`/exercices/${sessionId}/terminer`, { method: "POST" }, jeton);
}

export function lirePackDistant(chapitreId: string, jeton: string) {
  return api<PackChapitre>(`/chapitres/${chapitreId}/hors-ligne`, {}, jeton);
}

export function synchroniserParties(parties: PartieFile[], jeton: string) {
  return api<{ resultats: ResultatSync[] }>(
    "/sync/parties",
    { method: "POST", body: JSON.stringify({ parties }) },
    jeton,
  );
}
