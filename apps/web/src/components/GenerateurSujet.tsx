"use client";

import { useEffect, useMemo, useState } from "react";
import type { EnTeteSujet } from "@/export/entete";
import { telecharger } from "@/export/telecharger";
import {
  FORMATS,
  TYPES_DOCUMENT,
  generateExercises,
  genererLocalement,
  type DemandeGeneration,
  type Difficulte,
  type FormatExercice,
  type SujetGenere,
  type TypeDocument,
} from "@/services/generer-exercices";
import { enregistrerSujet, lireHistorique, type SujetEnregistre } from "@/services/historique";
import {
  CLASSES_PROGRESSION,
  MATIERES_PROGRESSION,
  PROGRESSIONS,
  type ClasseProgression,
  type MatiereProgression,
  filtrerProgressions,
} from "@/services/progressions";

const champ = "w-full rounded-2xl border border-line bg-card px-3 py-3 text-sm text-ink";

export function GenerateurSujet() {
  const [matiere, setMatiere] = useState<MatiereProgression>("Mathématiques");
  const [classe, setClasse] = useState<ClasseProgression>("6e");
  const [selection, setSelection] = useState<number[]>([]);
  const [typeDocument, setTypeDocument] = useState<TypeDocument>("evaluation");
  const [nombre, setNombre] = useState(4);
  const [difficulte, setDifficulte] = useState<Difficulte>("moyen");
  const [duree, setDuree] = useState("1 h");
  const [bareme, setBareme] = useState(20);
  const [formats, setFormats] = useState<FormatExercice[]>([
    "traditionnel",
    "qcm",
    "situation_integration",
  ]);
  const [avecCorrige, setAvecCorrige] = useState(true);
  const [etablissement, setEtablissement] = useState("");
  const [annee, setAnnee] = useState("2026-2027");
  const [professeurs, setProfesseurs] = useState("M. Nikoe Nestor");
  const [sujet, setSujet] = useState<SujetGenere | null>(null);
  const [historique, setHistorique] = useState<SujetEnregistre[]>([]);
  const [message, setMessage] = useState("");
  const [chargement, setChargement] = useState(false);

  const lecons = useMemo(
    () => filtrerProgressions(PROGRESSIONS, { matiere, classe }),
    [matiere, classe],
  );

  useEffect(() => {
    setHistorique(lireHistorique());
  }, []);

  function demande(): DemandeGeneration {
    return {
      lecons: selection.map((index) => lecons[index]).filter((item) => item !== undefined),
      typeDocument,
      nombre,
      difficulte,
      duree,
      bareme,
      formats,
      avecCorrige,
      graine: Date.now() % 100000,
    };
  }

  function enteteActuel(): EnTeteSujet {
    return {
      etablissement,
      classe,
      matiere,
      duree,
      anneeScolaire: annee,
      professeurs,
      bareme,
    };
  }

  function basculerFormat(format: FormatExercice) {
    setFormats((etat) =>
      etat.includes(format) ? etat.filter((item) => item !== format) : [...etat, format],
    );
  }

  async function generer() {
    setChargement(true);
    setMessage("");
    try {
      const produit = await generateExercises(demande());
      setSujet(produit);
      setHistorique(enregistrerSujet(produit, enteteActuel()));
    } catch (erreur) {
      setMessage(erreur instanceof Error ? erreur.message : "La génération a échoué.");
    } finally {
      setChargement(false);
    }
  }

  function regenerer(index: number) {
    if (!sujet) return;
    const actuel = sujet.exercices[index];
    const points = actuel.questions.reduce((somme, question) => somme + question.points, 0);
    const seul = genererLocalement({
      ...demande(),
      nombre: 1,
      bareme: points || 1,
      graine: Date.now() % 100000,
    });
    const exercices = sujet.exercices.slice();
    exercices[index] = { ...seul.exercices[0], numero: actuel.numero };
    setSujet({ ...sujet, exercices });
  }

  function modifierExercice(index: number, valeur: SujetGenere["exercices"][number]) {
    if (!sujet) return;
    const exercices = sujet.exercices.slice();
    exercices[index] = valeur;
    setSujet({ ...sujet, exercices });
  }

  async function exporter(format: "docx" | "pdf") {
    if (!sujet) return;
    const nom = `sujet-${matiere}-${classe}.${format}`;
    if (format === "docx") {
      const { exporterDocx } = await import("@/export/docx");
      telecharger(await exporterDocx(sujet, enteteActuel()), nom);
      return;
    }
    const { exporterPdf } = await import("@/export/pdf");
    telecharger(exporterPdf(sujet, enteteActuel()), nom);
  }

  return (
    <div className="grid gap-8">
      <section className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-green">
          Progressions officielles
        </p>
        <h1 className="mt-3 font-serif text-5xl leading-tight text-ink">Préparer un sujet.</h1>
        <p className="mt-4 text-muted">
          Les exercices restent dans les sous-titres de la leçon et au niveau de la classe.
          Tu peux les modifier avant l&apos;export.
        </p>
      </section>

      <section className="grid gap-4 rounded-3xl border border-line bg-card p-5 shadow-card">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="grid gap-2 text-sm">
            Matière
            <select
              className={champ}
              value={matiere}
              onChange={(event) => {
                setMatiere(event.target.value as MatiereProgression);
                setSelection([]);
              }}
            >
              {MATIERES_PROGRESSION.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
          <label className="grid gap-2 text-sm">
            Classe
            <select
              className={champ}
              value={classe}
              onChange={(event) => {
                setClasse(event.target.value as ClasseProgression);
                setSelection([]);
              }}
            >
              {CLASSES_PROGRESSION.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
        </div>

        <fieldset className="grid gap-2">
          <legend className="text-sm">Leçons, plusieurs choix possibles</legend>
          <div className="grid max-h-80 gap-2 overflow-auto pr-1">
            {lecons.map((lecon, index) => (
              <label
                key={`${lecon.semaine}-${lecon.lecon}-${index}`}
                className="flex min-h-11 items-start gap-3 rounded-2xl border border-line px-3 py-3 text-sm"
              >
                <input
                  type="checkbox"
                  className="mt-1"
                  checked={selection.includes(index)}
                  onChange={() =>
                    setSelection((etat) =>
                      etat.includes(index) ? etat.filter((item) => item !== index) : [...etat, index],
                    )
                  }
                />
                <span>
                  <span className="block text-ink">{lecon.lecon}</span>
                  <span className="mt-1 block text-xs text-muted">
                    S{lecon.semaine} · {lecon.theme} · {lecon.volume_horaire} h
                    {lecon.type_seance === "integration_evaluation_remediation"
                      ? " · intégration"
                      : ""}
                  </span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>
      </section>

      <section className="grid gap-4 rounded-3xl border border-line bg-card p-5 shadow-card">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="grid gap-2 text-sm">
            Type de document
            <select
              className={champ}
              value={typeDocument}
              onChange={(event) => setTypeDocument(event.target.value as TypeDocument)}
            >
              {TYPES_DOCUMENT.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-2 text-sm">
            Difficulté
            <select
              className={champ}
              value={difficulte}
              onChange={(event) => setDifficulte(event.target.value as Difficulte)}
            >
              <option value="facile">Facile</option>
              <option value="moyen">Moyen</option>
              <option value="difficile">Difficile</option>
            </select>
          </label>
          <label className="grid gap-2 text-sm">
            Nombre d&apos;exercices
            <input
              className={champ}
              type="number"
              min={1}
              max={12}
              value={nombre}
              onChange={(event) => setNombre(Number(event.target.value))}
            />
          </label>
          <label className="grid gap-2 text-sm">
            Durée
            <select className={champ} value={duree} onChange={(event) => setDuree(event.target.value)}>
              <option>30 min</option>
              <option>1 h</option>
              <option>2 h</option>
            </select>
          </label>
          <label className="grid gap-2 text-sm">
            Barème total
            <input
              className={champ}
              type="number"
              min={1}
              max={40}
              value={bareme}
              onChange={(event) => setBareme(Number(event.target.value))}
            />
          </label>
        </div>
        <fieldset className="grid gap-2">
          <legend className="text-sm">Formats</legend>
          <div className="grid gap-2 sm:grid-cols-2">
            {FORMATS.map((format) => (
              <label key={format.id} className="flex min-h-11 items-center gap-3 text-sm">
                <input
                  type="checkbox"
                  checked={formats.includes(format.id)}
                  onChange={() => basculerFormat(format.id)}
                />
                {format.label}
              </label>
            ))}
          </div>
        </fieldset>
        <label className="flex min-h-11 items-center gap-3 text-sm">
          <input
            type="checkbox"
            checked={avecCorrige}
            onChange={(event) => setAvecCorrige(event.target.checked)}
          />
          Avec corrigé détaillé et barème
        </label>
        <div className="grid gap-4 sm:grid-cols-3">
          <label className="grid gap-2 text-sm">
            Établissement
            <input
              className={champ}
              value={etablissement}
              placeholder="Collège"
              onChange={(event) => setEtablissement(event.target.value)}
            />
          </label>
          <label className="grid gap-2 text-sm">
            Année scolaire
            <input className={champ} value={annee} onChange={(event) => setAnnee(event.target.value)} />
          </label>
          <label className="grid gap-2 text-sm">
            Professeurs
            <input
              className={champ}
              value={professeurs}
              onChange={(event) => setProfesseurs(event.target.value)}
            />
          </label>
        </div>
        {message ? <p className="text-sm text-pct">{message}</p> : null}
        <button
          type="button"
          className="min-h-11 rounded-full bg-green px-5 py-3 text-sm font-semibold text-card disabled:opacity-60"
          disabled={chargement}
          onClick={() => void generer()}
        >
          {chargement ? "Génération…" : "Générer le sujet"}
        </button>
      </section>

      {sujet ? (
        <section className="grid gap-4">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className="min-h-11 rounded-full border border-line bg-card px-4 py-2 text-sm"
              onClick={() => void exporter("docx")}
            >
              Exporter Word
            </button>
            <button
              type="button"
              className="min-h-11 rounded-full border border-line bg-card px-4 py-2 text-sm"
              onClick={() => void exporter("pdf")}
            >
              Exporter PDF
            </button>
          </div>
          <article className="grid gap-4 rounded-3xl border border-line bg-card p-5 shadow-card">
            <label className="grid gap-2 text-sm">
              Titre
              <input
                className={champ}
                value={sujet.titre}
                onChange={(event) => setSujet({ ...sujet, titre: event.target.value })}
              />
            </label>
            <label className="grid gap-2 text-sm">
              Consignes
              <textarea
                className={`${champ} min-h-24`}
                value={sujet.consignes}
                onChange={(event) => setSujet({ ...sujet, consignes: event.target.value })}
              />
            </label>
            {sujet.exercices.map((exercice, index) => (
              <div key={exercice.numero} className="grid gap-3 rounded-2xl border border-line p-4">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="font-serif text-2xl text-ink">Exercice {exercice.numero}</h2>
                  <button
                    type="button"
                    className="min-h-11 rounded-full border border-line px-3 py-2 text-sm"
                    onClick={() => regenerer(index)}
                  >
                    Régénérer
                  </button>
                </div>
                <textarea
                  className={`${champ} min-h-28`}
                  value={exercice.enonce}
                  onChange={(event) =>
                    modifierExercice(index, { ...exercice, enonce: event.target.value })
                  }
                />
                {exercice.questions.map((question, questionIndex) => (
                  <label key={questionIndex} className="grid gap-2 text-sm">
                    Question · {question.points} point{question.points > 1 ? "s" : ""}
                    <textarea
                      className={`${champ} min-h-24`}
                      value={question.texte}
                      onChange={(event) => {
                        const questions = exercice.questions.slice();
                        questions[questionIndex] = { ...question, texte: event.target.value };
                        modifierExercice(index, { ...exercice, questions });
                      }}
                    />
                  </label>
                ))}
                {exercice.corrige !== null ? (
                  <label className="grid gap-2 text-sm">
                    Corrigé
                    <textarea
                      className={`${champ} min-h-24`}
                      value={exercice.corrige}
                      onChange={(event) =>
                        modifierExercice(index, { ...exercice, corrige: event.target.value })
                      }
                    />
                  </label>
                ) : null}
              </div>
            ))}
          </article>
        </section>
      ) : null}

      {historique.length > 0 ? (
        <section className="grid gap-3">
          <h2 className="font-serif text-3xl text-ink">Sujets enregistrés sur cet appareil</h2>
          {historique.map((entree) => (
            <button
              key={entree.id}
              type="button"
              className="rounded-2xl border border-line bg-card px-4 py-3 text-left text-sm"
              onClick={() => {
                setSujet(entree.sujet);
                setEtablissement(entree.entete.etablissement);
                setAnnee(entree.entete.anneeScolaire);
                setProfesseurs(entree.entete.professeurs);
              }}
            >
              <span className="block text-ink">{entree.sujet.titre}</span>
              <span className="mt-1 block text-xs text-muted">
                {new Date(entree.date).toLocaleString("fr-FR")} · {entree.entete.matiere} ·{" "}
                {entree.entete.classe}
              </span>
            </button>
          ))}
        </section>
      ) : null}
    </div>
  );
}
