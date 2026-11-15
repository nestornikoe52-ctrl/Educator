import type { AuthReponse, MatiereCode, NiveauCode, Utilisateur } from "@education-togo/shared";

const CLE = "education-togo-comptes";

type CompteStocke = Utilisateur & { empreinte: string };

function lireComptes(): CompteStocke[] {
  if (typeof localStorage === "undefined") {
    return [];
  }
  try {
    const brut = localStorage.getItem(CLE);
    const valeur = brut ? (JSON.parse(brut) as CompteStocke[]) : [];
    return Array.isArray(valeur) ? valeur : [];
  } catch {
    return [];
  }
}

function ecrireComptes(comptes: CompteStocke[]) {
  localStorage.setItem(CLE, JSON.stringify(comptes));
}

async function empreinte(motDePasse: string) {
  const octets = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(motDePasse));
  return [...new Uint8Array(octets)].map((valeur) => valeur.toString(16).padStart(2, "0")).join("");
}

function versUtilisateur(compte: CompteStocke): Utilisateur {
  return {
    id: compte.id,
    nom: compte.nom,
    email: compte.email,
    role: compte.role,
    classe: compte.classe,
    matieres: compte.matieres,
  };
}

export function profilLocal(jeton: string | null): Utilisateur | null {
  if (!jeton?.startsWith("local:")) {
    return null;
  }
  const email = jeton.slice("local:".length);
  const compte = lireComptes().find((item) => item.email === email);
  return compte ? versUtilisateur(compte) : null;
}

export async function inscrireLocal(entree: {
  nom: string;
  email: string;
  motDePasse: string;
  classe: NiveauCode;
  matieres: MatiereCode[];
}): Promise<AuthReponse> {
  const email = entree.email.trim().toLowerCase();
  const comptes = lireComptes();
  if (comptes.some((compte) => compte.email === email)) {
    throw new Error("Un compte existe déjà avec cet email.");
  }
  const compte: CompteStocke = {
    id: crypto.randomUUID(),
    nom: entree.nom.trim(),
    email,
    role: "eleve",
    classe: entree.classe,
    matieres: entree.matieres,
    empreinte: await empreinte(entree.motDePasse),
  };
  ecrireComptes([...comptes, compte]);
  return { jeton: `local:${email}`, utilisateur: versUtilisateur(compte) };
}

export async function connecterLocal(entree: { email: string; motDePasse: string }): Promise<AuthReponse> {
  const email = entree.email.trim().toLowerCase();
  const compte = lireComptes().find((item) => item.email === email);
  if (!compte || compte.empreinte !== (await empreinte(entree.motDePasse))) {
    throw new Error("Email ou mot de passe incorrect.");
  }
  return { jeton: `local:${email}`, utilisateur: versUtilisateur(compte) };
}
