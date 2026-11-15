const CLE_JETON = "education-togo-jeton";

export function lireJeton() {
  if (typeof window === "undefined") {
    return null;
  }
  return localStorage.getItem(CLE_JETON);
}

export function ecrireJeton(jeton: string) {
  localStorage.setItem(CLE_JETON, jeton);
}

export function effacerJeton() {
  localStorage.removeItem(CLE_JETON);
}
