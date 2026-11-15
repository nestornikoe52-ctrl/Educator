import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import type {
  BilanExercices,
  CorrectionExercice,
  MatiereCode,
  NiveauCode,
  PartieExercices,
  ReponseExerciceInput,
  ResultatOuvert,
} from "@education-togo/shared";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class ExercicesService {
  constructor(private readonly prisma: PrismaService) {}

  async commencer(utilisateurId: string, chapitreId: string): Promise<PartieExercices> {
    const chapitre = await this.prisma.chapitre.findUnique({ where: { id: chapitreId } });
    if (!chapitre) {
      throw new NotFoundException("Ce chapitre n’existe pas.");
    }

    const exercices = await this.prisma.exercice.findMany({
      where: { chapitreId, type: "ouverte" },
      orderBy: { ordre: "asc" },
    });
    if (exercices.length === 0) {
      throw new NotFoundException("Ce chapitre n’a pas encore d’exercices.");
    }

    const session = await this.prisma.session.create({
      data: {
        userId: utilisateurId,
        chapitreId,
        type: "exercices",
        score: 0,
        total: exercices.length,
      },
    });

    return {
      sessionId: session.id,
      questions: exercices.map((exercice) => ({
        id: exercice.id,
        ordre: exercice.ordre,
        question: exercice.question,
      })),
    };
  }

  async repondre(
    utilisateurId: string,
    sessionId: string,
    input: ReponseExerciceInput,
  ): Promise<CorrectionExercice> {
    const session = await this.sessionOuverte(utilisateurId, sessionId);
    const exercice = await this.prisma.exercice.findFirst({
      where: { id: input.exerciceId, chapitreId: session.chapitreId, type: "ouverte" },
    });
    if (!exercice) {
      throw new NotFoundException("Cet exercice ne fait pas partie de la série.");
    }

    const deja = await this.prisma.resultat.findFirst({
      where: { sessionId, exerciceId: exercice.id },
    });
    if (deja) {
      throw new ConflictException("Cet exercice a déjà reçu une réponse.");
    }

    const miseAJour = await this.prisma.$transaction(async (tx) => {
      await tx.resultat.create({
        data: {
          userId: utilisateurId,
          exerciceId: exercice.id,
          sessionId,
          reponseDonnee: input.reponse,
          correct: false,
          feedback: null,
        },
      });
      const reponses = await tx.resultat.count({ where: { sessionId } });
      const terminee = reponses >= session.total;
      const suivante = await tx.session.update({
        where: { id: sessionId },
        data: { score: reponses, fin: terminee ? new Date() : null },
      });
      return { score: suivante.score, total: suivante.total, terminee };
    });

    return {
      correct: false,
      feedback: "Ta réponse est enregistrée. Le professeur pourra la lire.",
      piste: exercice.explication,
      score: miseAJour.score,
      total: miseAJour.total,
      terminee: miseAJour.terminee,
    };
  }

  async mesCopies(utilisateurId: string): Promise<ResultatOuvert[]> {
    const resultats = await this.prisma.resultat.findMany({
      where: { userId: utilisateurId, exercice: { type: "ouverte" } },
      orderBy: { date: "desc" },
      take: 40,
      include: { exercice: { include: { chapitre: { include: { niveau: true, matiere: true } } } } },
    });

    return resultats.map((resultat) => ({
      id: resultat.id,
      date: resultat.date.toISOString(),
      revue: resultat.revue,
      correct: resultat.revue ? resultat.correct : false,
      commentaire: resultat.revue ? resultat.feedback : null,
      chapitre: {
        id: resultat.exercice.chapitre.id,
        titre: resultat.exercice.chapitre.titre,
        niveau: {
          code: resultat.exercice.chapitre.niveau.code as NiveauCode,
          libelle: resultat.exercice.chapitre.niveau.libelle,
        },
        matiere: {
          code: resultat.exercice.chapitre.matiere.code as MatiereCode,
          nom: resultat.exercice.chapitre.matiere.nom,
        },
      },
      question: resultat.exercice.question,
      reponse: resultat.reponseDonnee,
      piste: resultat.exercice.explication,
    }));
  }

  async terminer(utilisateurId: string, sessionId: string): Promise<BilanExercices> {
    const session = await this.prisma.session.findFirst({
      where: { id: sessionId, userId: utilisateurId, type: "exercices" },
    });
    if (!session) {
      throw new NotFoundException("Cette série est introuvable.");
    }
    if (session.fin) {
      return { score: session.score, total: session.total };
    }
    const close = await this.prisma.session.update({
      where: { id: session.id },
      data: { fin: new Date() },
    });
    return { score: close.score, total: close.total };
  }

  private async sessionOuverte(utilisateurId: string, sessionId: string) {
    const session = await this.prisma.session.findFirst({
      where: { id: sessionId, userId: utilisateurId, type: "exercices" },
    });
    if (!session) {
      throw new NotFoundException("Cette série est introuvable.");
    }
    if (session.fin) {
      throw new ConflictException("Cette série est terminée.");
    }
    return session;
  }
}
