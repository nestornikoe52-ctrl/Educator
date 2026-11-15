"use client";

import { useEffect } from "react";
import { synchroniserFile } from "@/lib/horsLigne";
import { lireJeton } from "@/lib/session";

export function FileScores() {
  useEffect(() => {
    const envoyer = () => {
      const jeton = lireJeton();
      if (jeton) {
        void synchroniserFile(jeton).catch(() => undefined);
      }
    };
    envoyer();
    window.addEventListener("online", envoyer);
    return () => window.removeEventListener("online", envoyer);
  }, []);

  return null;
}
