import { jsPDF } from "jspdf";
import type { SujetGenere } from "../services/generer-exercices";
import type { EnTeteSujet } from "./entete";

export function exporterPdf(sujet: SujetGenere, entete: EnTeteSujet) {
  const document = new jsPDF({ unit: "mm", format: "a4" });
  let y = 16;
  const ajouter = (texte: string, taille = 11, gras = false) => {
    document.setFont("helvetica", gras ? "bold" : "normal");
    document.setFontSize(taille);
    const lignes = document.splitTextToSize(texte, 180) as string[];
    const hauteur = lignes.length * taille * 0.45;
    if (y + hauteur > 285) {
      document.addPage();
      y = 16;
    }
    document.text(lignes, 15, y);
    y += hauteur + 3;
  };
  ajouter(entete.etablissement || "Etablissement", 16, true);
  ajouter(`Annee scolaire : ${entete.anneeScolaire}`);
  ajouter(`Classe : ${entete.classe}    Matiere : ${entete.matiere}`);
  ajouter(`Duree : ${entete.duree}    Bareme : /${entete.bareme}`);
  ajouter(`Professeur : ${entete.professeurs}`);
  ajouter(sujet.titre, 14, true);
  ajouter(sujet.consignes);
  for (const exercice of sujet.exercices) {
    ajouter(`Exercice ${exercice.numero}`, 13, true);
    ajouter(exercice.enonce);
    for (const question of exercice.questions) {
      const unite = question.points > 1 ? "points" : "point";
      ajouter(`${question.texte} (${question.points} ${unite})`);
    }
    if (exercice.corrige) ajouter(`Corrige : ${exercice.corrige}`);
  }
  return document.output("blob");
}
