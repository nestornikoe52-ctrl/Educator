"use client";

import type { RoleUtilisateur } from "@education-togo/shared";
import Link from "next/link";
import { useEffect, useState } from "react";
import { lireProfil } from "@/lib/api";
import { profilLocal } from "@/lib/comptesLocaux";
import { effacerJeton, lireJeton } from "@/lib/session";

export function AuthMenu() {
  const [compte, setCompte] = useState<{ nom: string; role: RoleUtilisateur } | null>(null);

  useEffect(() => {
    const jeton = lireJeton();
    if (!jeton) {
      return;
    }
    const local = profilLocal(jeton);
    if (local) {
      setCompte({ nom: local.nom, role: local.role });
      return;
    }
    lireProfil(jeton)
      .then((profil) => setCompte({ nom: profil.nom, role: profil.role }))
      .catch(() => effacerJeton());
  }, []);

  if (!compte) {
    return (
      <>
        <Link
          href="/connexion"
          className="rounded-full px-4 py-2 text-ink transition hover:bg-card"
        >
          Connexion
        </Link>
        <Link
          href="/inscription"
          className="rounded-full bg-green px-4 py-2 text-card transition hover:bg-green-deep"
        >
          Inscription
        </Link>
      </>
    );
  }

  return (
    <>
      {compte.role === "professeur" ? (
        <Link href="/professeur" className="rounded-full bg-card px-4 py-2 text-ink">
          Copies
        </Link>
      ) : null}
      <Link
        href={compte.role === "professeur" ? "/professeur" : "/profil"}
        className="rounded-full bg-card px-4 py-2 text-ink"
      >
        {compte.nom}
      </Link>
      <button
        type="button"
        className="rounded-full px-4 py-2 text-muted transition hover:text-ink"
        onClick={() => {
          effacerJeton();
          window.location.href = "/";
        }}
      >
        Sortir
      </button>
    </>
  );
}
