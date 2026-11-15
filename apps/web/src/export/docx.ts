import { Document, HeadingLevel, Packer, Paragraph, TextRun } from "docx";
import type { SujetGenere } from "../services/generer-exercices";
import type { EnTeteSujet } from "./entete";

export async function exporterDocx(sujet: SujetGenere, entete: EnTeteSujet) {
  const lignes = [
    new Paragraph({
      text: entete.etablissement || "Établissement",
      heading: HeadingLevel.HEADING_1,
    }),
    new Paragraph({ children: [new TextRun(`Année scolaire : ${entete.anneeScolaire}`)] }),
    new Paragraph({
      children: [new TextRun(`Classe : ${entete.classe}    Matière : ${entete.matiere}`)],
    }),
    new Paragraph({
      children: [new TextRun(`Durée : ${entete.duree}    Barème : /${entete.bareme}`)],
    }),
    new Paragraph({ children: [new TextRun(`Professeur : ${entete.professeurs}`)] }),
    new Paragraph({ text: "" }),
    new Paragraph({ text: sujet.titre, heading: HeadingLevel.HEADING_2 }),
    new Paragraph({ text: sujet.consignes }),
  ];
  for (const exercice of sujet.exercices) {
    lignes.push(new Paragraph({ text: `Exercice ${exercice.numero}`, heading: HeadingLevel.HEADING_3 }));
    lignes.push(new Paragraph({ text: exercice.enonce }));
    for (const question of exercice.questions) {
      const unite = question.points > 1 ? "points" : "point";
      lignes.push(new Paragraph({ text: `${question.texte} (${question.points} ${unite})` }));
    }
    if (exercice.corrige) {
      lignes.push(new Paragraph({ text: `Corrigé : ${exercice.corrige}` }));
    }
  }
  const document = new Document({ sections: [{ children: lignes }] });
  return Packer.toBlob(document);
}
