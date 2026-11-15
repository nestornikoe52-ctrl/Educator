"use client";

import { MATIERES, NIVEAUX, type MatiereCode, type NiveauCode } from "@education-togo/shared";
import { useState } from "react";
import { ServeurInjoignable, connecter, inscrire } from "@/lib/api";
import { connecterLocal, inscrireLocal } from "@/lib/comptesLocaux";
import { ecrireJeton } from "@/lib/session";

export function CompteForm({ mode }: { mode: "inscription" | "connexion" }) {
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [classe, setClasse] = useState<NiveauCode>("6e");
  const [matieres, setMatieres] = useState<MatiereCode[]>(MATIERES.map((matiere) => matiere.code));
  const [erreur, setErreur] = useState<string | null>(null);
  const [envoi, setEnvoi] = useState(false);

  function basculerMatiere(code: MatiereCode) {
    setMatieres((courantes) =>
      courantes.includes(code) ? courantes.filter((item) => item !== code) : [...courantes, code],
    );
  }

  async function soumettre(event: React.FormEvent) {
    event.preventDefault();
    setErreur(null);

    if (mode === "inscription" && motDePasse !== confirmation) {
      setErreur("Les deux mots de passe ne correspondent pas.");
      return;
    }

    setEnvoi(true);
    try {
      let reponse;
      try {
        reponse =
          mode === "inscription"
            ? await inscrire({ nom, email, motDePasse, classe, matieres })
            : await connecter({ email, motDePasse });
      } catch (error) {
        if (!(error instanceof ServeurInjoignable)) {
          throw error;
        }
        reponse =
          mode === "inscription"
            ? await inscrireLocal({ nom, email, motDePasse, classe, matieres })
            : await connecterLocal({ email, motDePasse });
      }
      ecrireJeton(reponse.jeton);
      window.location.assign(reponse.utilisateur.role === "professeur" ? "/professeur" : "/profil");
    } catch (error) {
      setErreur(
        error instanceof ServeurInjoignable
          ? "Le compte n’a pas pu être ouvert."
          : error instanceof Error
            ? error.message
            : "La requête a échoué.",
      );
    } finally {
      setEnvoi(false);
    }
  }

  return (
    <form onSubmit={soumettre} className="mt-8 grid max-w-xl gap-5">
      {mode === "inscription" ? (
        <label className="grid gap-2 text-sm text-ink">
          Nom
          <input
            required
            value={nom}
            onChange={(event) => setNom(event.target.value)}
            className="rounded-2xl border border-line bg-card px-4 py-3 text-base outline-none focus:border-green"
            autoComplete="name"
          />
        </label>
      ) : null}

      <label className="grid gap-2 text-sm text-ink">
        Email
        <input
          required
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="rounded-2xl border border-line bg-card px-4 py-3 text-base outline-none focus:border-green"
          autoComplete="email"
        />
      </label>

      <label className="grid gap-2 text-sm text-ink">
        Mot de passe
        <input
          required
          type="password"
          minLength={mode === "inscription" ? 8 : 1}
          value={motDePasse}
          onChange={(event) => setMotDePasse(event.target.value)}
          className="rounded-2xl border border-line bg-card px-4 py-3 text-base outline-none focus:border-green"
          autoComplete={mode === "inscription" ? "new-password" : "current-password"}
        />
      </label>

      {mode === "inscription" ? (
        <>
          <label className="grid gap-2 text-sm text-ink">
            Confirmer le mot de passe
            <input
              required
              type="password"
              value={confirmation}
              onChange={(event) => setConfirmation(event.target.value)}
              className="rounded-2xl border border-line bg-card px-4 py-3 text-base outline-none focus:border-green"
              autoComplete="new-password"
            />
          </label>

          <fieldset className="grid gap-3">
            <legend className="text-sm text-ink">Classe</legend>
            <div className="flex flex-wrap gap-2">
              {NIVEAUX.map((niveau) => (
                <label
                  key={niveau.code}
                  className={`cursor-pointer rounded-full border px-4 py-2 text-sm ${
                    classe === niveau.code
                      ? "border-green bg-green text-card"
                      : "border-line bg-card text-ink"
                  }`}
                >
                  <input
                    type="radio"
                    name="classe"
                    value={niveau.code}
                    checked={classe === niveau.code}
                    onChange={() => setClasse(niveau.code)}
                    className="sr-only"
                  />
                  {niveau.libelle}
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className="grid gap-3">
            <legend className="text-sm text-ink">Matières suivies</legend>
            <div className="grid gap-2">
              {MATIERES.map((matiere) => (
                <label key={matiere.code} className="flex items-center gap-3 text-sm text-ink">
                  <input
                    type="checkbox"
                    checked={matieres.includes(matiere.code)}
                    onChange={() => basculerMatiere(matiere.code)}
                    className="h-4 w-4 accent-green"
                  />
                  {matiere.nom}
                </label>
              ))}
            </div>
          </fieldset>
        </>
      ) : null}

      {erreur ? (
        <p className="rounded-2xl bg-[#f8e8e4] px-4 py-3 text-sm text-[#8d2b1f]">{erreur}</p>
      ) : null}

      <button
        type="submit"
        disabled={envoi}
        className="rounded-full bg-green-deep px-5 py-3 text-card disabled:opacity-60"
      >
        {envoi ? "Envoi…" : mode === "inscription" ? "Créer mon compte" : "Entrer"}
      </button>
    </form>
  );
}
