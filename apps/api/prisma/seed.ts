import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { CHAPITRES, CREATEUR, MATIERES, NIVEAUX } from "@education-togo/shared";
import bcrypt from "bcryptjs";
import { PrismaClient } from "../src/generated/prisma/client";
import { EXERCICES_OUVERTS } from "./exercices";
import { QUESTIONS_QCM } from "./qcm";
import { QUESTIONS_TRIVIA } from "./trivia";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL est absent.");
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

async function main() {
  for (const niveau of NIVEAUX) {
    await prisma.niveau.upsert({
      where: { code: niveau.code },
      update: { libelle: niveau.libelle, ordre: niveau.ordre },
      create: {
        code: niveau.code,
        libelle: niveau.libelle,
        ordre: niveau.ordre,
      },
    });
  }

  for (const matiere of MATIERES) {
    await prisma.matiere.upsert({
      where: { code: matiere.code },
      update: { nom: matiere.nom },
      create: { code: matiere.code, nom: matiere.nom },
    });
  }

  const niveaux = await prisma.niveau.findMany();
  const matieres = await prisma.matiere.findMany();
  const niveauParCode = new Map(niveaux.map((niveau) => [niveau.code, niveau.id]));
  const matiereParCode = new Map(matieres.map((matiere) => [matiere.code, matiere.id]));
  const ordre = new Map<string, number>();

  for (const lecon of CHAPITRES) {
    const niveauId = niveauParCode.get(lecon.niveau);
    const matiereId = matiereParCode.get(lecon.matiere);
    if (!niveauId || !matiereId) {
      throw new Error(`Niveau ou matière inconnu : ${lecon.niveau} / ${lecon.matiere}`);
    }
    const cle = `${niveauId}:${matiereId}`;
    const numero = (ordre.get(cle) ?? 0) + 1;
    ordre.set(cle, numero);

    await prisma.chapitre.upsert({
      where: {
        niveauId_matiereId_ordre: { niveauId, matiereId, ordre: numero },
      },
      update: { titre: lecon.titre, resumeCours: lecon.resume },
      create: {
        titre: lecon.titre,
        resumeCours: lecon.resume,
        ordre: numero,
        niveauId,
        matiereId,
      },
    });
  }

  const rangTrivia = new Map<string, number>();
  for (const question of QUESTIONS_TRIVIA) {
    const chapitre = await prisma.chapitre.findFirst({
      where: {
        ordre: question.chapitreOrdre,
        niveau: { code: question.niveau },
        matiere: { code: question.matiere },
      },
    });
    if (!chapitre) {
      throw new Error(
        `Chapitre introuvable pour le trivia : ${question.niveau} ${question.matiere} n°${question.chapitreOrdre}`,
      );
    }
    const cle = chapitre.id;
    const numero = 1000 + (rangTrivia.get(cle) ?? 0) + 1;
    rangTrivia.set(cle, (rangTrivia.get(cle) ?? 0) + 1);
    await prisma.exercice.upsert({
      where: { chapitreId_ordre: { chapitreId: chapitre.id, ordre: numero } },
      update: {
        question: question.question,
        type: "trivia",
        choixPossibles: [...question.choix],
        bonneReponse: question.bonneReponse,
        explication: question.explication,
        dureeSecondes: 20,
      },
      create: {
        chapitreId: chapitre.id,
        ordre: numero,
        question: question.question,
        type: "trivia",
        choixPossibles: [...question.choix],
        bonneReponse: question.bonneReponse,
        explication: question.explication,
        dureeSecondes: 20,
      },
    });
  }

  const rangQcm = new Map<string, number>();
  for (const question of QUESTIONS_QCM) {
    const chapitre = await prisma.chapitre.findFirst({
      where: {
        ordre: question.chapitreOrdre,
        niveau: { code: question.niveau },
        matiere: { code: question.matiere },
      },
    });
    if (!chapitre) {
      throw new Error(
        `Chapitre introuvable pour le QCM : ${question.niveau} ${question.matiere} n°${question.chapitreOrdre}`,
      );
    }
    const cle = chapitre.id;
    const numero = 2000 + (rangQcm.get(cle) ?? 0) + 1;
    rangQcm.set(cle, (rangQcm.get(cle) ?? 0) + 1);
    await prisma.exercice.upsert({
      where: { chapitreId_ordre: { chapitreId: chapitre.id, ordre: numero } },
      update: {
        question: question.question,
        type: "qcm",
        choixPossibles: [...question.choix],
        bonneReponse: question.bonneReponse,
        explication: question.explication,
        dureeSecondes: null,
      },
      create: {
        chapitreId: chapitre.id,
        ordre: numero,
        question: question.question,
        type: "qcm",
        choixPossibles: [...question.choix],
        bonneReponse: question.bonneReponse,
        explication: question.explication,
      },
    });
  }

  const rangExercice = new Map<string, number>();
  for (const exercice of EXERCICES_OUVERTS) {
    const chapitre = await prisma.chapitre.findFirst({
      where: {
        ordre: exercice.chapitreOrdre,
        niveau: { code: exercice.niveau },
        matiere: { code: exercice.matiere },
      },
    });
    if (!chapitre) {
      throw new Error(
        `Chapitre introuvable pour l’exercice : ${exercice.niveau} ${exercice.matiere} n°${exercice.chapitreOrdre}`,
      );
    }
    const cle = chapitre.id;
    const numero = (rangExercice.get(cle) ?? 0) + 1;
    rangExercice.set(cle, numero);
    await prisma.exercice.upsert({
      where: { chapitreId_ordre: { chapitreId: chapitre.id, ordre: numero } },
      update: {
        question: exercice.question,
        type: "ouverte",
        choixPossibles: [],
        bonneReponse: exercice.critere,
        explication: exercice.piste,
        dureeSecondes: null,
      },
      create: {
        chapitreId: chapitre.id,
        ordre: numero,
        question: exercice.question,
        type: "ouverte",
        choixPossibles: [],
        bonneReponse: exercice.critere,
        explication: exercice.piste,
      },
    });
  }

  const emailProfesseur = process.env.PROFESSEUR_EMAIL?.trim().toLowerCase();
  const motDePasseProfesseur = process.env.PROFESSEUR_MOT_DE_PASSE;
  if (emailProfesseur && motDePasseProfesseur) {
    const motDePasseHash = await bcrypt.hash(motDePasseProfesseur, 12);
    await prisma.utilisateur.upsert({
      where: { email: emailProfesseur },
      update: {
        nom: CREATEUR.nom,
        role: "professeur",
        niveauId: null,
        motDePasseHash,
      },
      create: {
        nom: CREATEUR.nom,
        email: emailProfesseur,
        motDePasseHash,
        role: "professeur",
        matieres: {
          create: matieres.map((matiere) => ({ matiereId: matiere.id })),
        },
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error: unknown) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
