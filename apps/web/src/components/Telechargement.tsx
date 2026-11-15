"use client";

import { useEffect, useState } from "react";
import { ServeurInjoignable, lirePackDistant } from "@/lib/api";
import { packIntegre } from "@/lib/contenuLocal";
import { ecrirePack, lirePack } from "@/lib/horsLigne";
import { lireJeton } from "@/lib/session";

export function Telechargement({ chapitreId }: { chapitreId: string }) {
  const [pret, setPret] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    setPret(Boolean(lirePack(chapitreId)));
  }, [chapitreId]);

  async function telecharger() {
    const integre = packIntegre(chapitreId);
    if (integre && (integre.qcm.length > 0 || integre.trivia.length > 0)) {
      ecrirePack(integre);
      setPret(true);
      setMessage("QCM et trivia sont prêts hors ligne.");
      return;
    }
    const jeton = lireJeton();
    if (!jeton) {
      setMessage("Connecte-toi pour garder ce chapitre sur l’appareil.");
      return;
    }
    setMessage("Téléchargement…");
    try {
      ecrirePack(await lirePackDistant(chapitreId, jeton));
      setPret(true);
      setMessage("QCM et trivia sont prêts hors ligne.");
    } catch (error: unknown) {
      setMessage(
        error instanceof ServeurInjoignable
          ? "Le téléchargement reste sur cet appareil."
          : error instanceof Error
            ? error.message
            : "Le téléchargement a échoué.",
      );
    }
  }

  return (
    <div className="mt-6">
      <button
        type="button"
        onClick={() => void telecharger()}
        className="rounded-full border border-green px-4 py-2 text-sm text-green"
      >
        {pret ? "Mettre à jour hors ligne" : "Télécharger hors ligne"}
      </button>
      {message ? <p className="mt-3 text-sm text-muted">{message}</p> : null}
    </div>
  );
}
