import { CHAPITRES, MATIERES, NIVEAUX, type ChapitrePublie } from "@education-togo/shared";

export function chapitresDuCatalogue(): ChapitrePublie[] {
  const compte = new Map<string, number>();
  return CHAPITRES.map((lecon) => {
    const cle = `${lecon.niveau}:${lecon.matiere}`;
    const ordre = (compte.get(cle) ?? 0) + 1;
    compte.set(cle, ordre);
    const niveau = NIVEAUX.find((item) => item.code === lecon.niveau);
    const matiere = MATIERES.find((item) => item.code === lecon.matiere);
    if (!niveau || !matiere) {
      throw new Error(`Catalogue incomplet : ${lecon.niveau} ${lecon.matiere}`);
    }
    return {
      id: `${lecon.niveau}-${lecon.matiere}-${ordre}`,
      titre: lecon.titre,
      ordre,
      resumeCours: lecon.resume,
      niveau: { code: niveau.code, libelle: niveau.libelle },
      matiere: { code: matiere.code, nom: matiere.nom },
    };
  });
}

export function chapitreParId(id: string) {
  return chapitresDuCatalogue().find((chapitre) => chapitre.id === id) ?? null;
}

export function chapitresDe(niveau: string, matiere: string) {
  return chapitresDuCatalogue().filter(
    (chapitre) => chapitre.niveau.code === niveau && chapitre.matiere.code === matiere,
  );
}
