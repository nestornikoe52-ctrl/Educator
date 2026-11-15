import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { generateExercises, promptInterne } from "./generer-exercices.ts";
import { PROGRESSIONS, filtrerProgressions, validerLecon } from "./progressions.ts";

describe("progressions", () => {
  it("valide chaque leçon du fichier JSON", () => {
    const erreurs = PROGRESSIONS.flatMap((lecon, index) =>
      validerLecon(lecon).map((erreur) => `${index} ${lecon.lecon} : ${erreur}`),
    );
    assert.deepEqual(erreurs, []);
  });

  it("filtre les mathématiques de 6e", () => {
    const lecons = filtrerProgressions(PROGRESSIONS, { matiere: "Mathématiques", classe: "6e" });
    assert.equal(lecons.length, 18);
    assert.equal(lecons.reduce((somme, lecon) => somme + lecon.volume_horaire, 0), 100);
  });

  it("retrouve une leçon et la séance d'intégration qui la précède", () => {
    const droites = filtrerProgressions(PROGRESSIONS, {
      matiere: "Mathématiques",
      classe: "6e",
      lecons: ["Droites du plan"],
    });
    assert.equal(droites.length, 1);
    const integration = filtrerProgressions(PROGRESSIONS, {
      matiere: "Mathématiques",
      classe: "6e",
    }).find((lecon) => lecon.type_seance === "integration_evaluation_remediation");
    assert.ok(integration);
    assert.deepEqual(integration.sous_titres.slice(0, 4), [
      "Droites du plan",
      "Arithmétique",
      "Segments",
      "Nombres décimaux / Programme de calcul",
    ]);
  });
});

describe("generateExercises", () => {
  const lecon = PROGRESSIONS.find((item) => item.lecon === "Fractions" && item.classe === "6e");
  assert.ok(lecon);

  it("répartit le barème et reste dans la leçon", async () => {
    const sujet = await generateExercises({
      lecons: [lecon],
      typeDocument: "devoir",
      nombre: 3,
      difficulte: "moyen",
      duree: "1 h",
      bareme: 20,
      formats: ["traditionnel", "qcm"],
      avecCorrige: true,
      graine: 4,
    });
    const points = sujet.exercices.flatMap((exercice) => exercice.questions.map((question) => question.points));
    assert.equal(points.reduce((somme, point) => somme + point, 0), 20);
    assert.match(sujet.consignes, /Fractions/);
    assert.match(sujet.exercices[0].corrige ?? "", /dfrac/);
  });

  it("retire le corrigé quand l'option est décochée", async () => {
    const sujet = await generateExercises({
      lecons: [lecon],
      typeDocument: "interrogation",
      nombre: 1,
      difficulte: "facile",
      duree: "30 min",
      bareme: 10,
      formats: ["vrai_faux"],
      avecCorrige: false,
    });
    assert.equal(sujet.exercices[0].corrige, null);
  });

  it("écrit le prompt interne avec les sous-titres", () => {
    const prompt = promptInterne({
      lecons: [lecon],
      typeDocument: "evaluation",
      nombre: 2,
      difficulte: "difficile",
      duree: "2 h",
      bareme: 20,
      formats: ["situation_integration"],
      avecCorrige: true,
    });
    assert.match(prompt, /6e/);
    assert.match(prompt, /Fractions/);
    assert.match(prompt, /contexte togolais/);
  });

  it("accepte un moteur de langage remplaçable", async () => {
    const sujet = await generateExercises(
      {
        lecons: [lecon],
        typeDocument: "revision",
        nombre: 1,
        difficulte: "facile",
        duree: "30 min",
        bareme: 5,
        formats: ["qcm"],
        avecCorrige: true,
      },
      async () =>
        JSON.stringify({
          titre: "Sujet du modèle",
          consignes: "Consigne",
          exercices: [
            {
              numero: 1,
              type: "qcm",
              enonce: "Énoncé",
              questions: [{ texte: "Question", points: 5 }],
              corrige: "A",
            },
          ],
        }),
    );
    assert.equal(sujet.titre, "Sujet du modèle");
  });
});
