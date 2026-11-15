import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import type { BilanQcm, CorrectionQcm, PartieQcm, ReponseQcmInput } from "@education-togo/shared";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class QcmService {
  constructor(private readonly prisma: PrismaService) {}

  async commencer(utilisateurId: string, chapitreId: string): Promise<PartieQcm> {
    const chapitre = await this.prisma.chapitre.findUnique({ where: { id: chapitreId } });
    if (!chapitre) {
      throw new NotFoundException("Ce chapitre n’existe pas.");
    }

    const exercices = await this.prisma.exercice.findMany({
      where: { chapitreId, type: "qcm" },
      orderBy: { ordre: "asc" },
    });
    if (exercices.length === 0) {
      throw new NotFoundException("Ce chapitre n’a pas encore de QCM.");
    }

    const session = await this.prisma.session.create({
      data: {
        userId: utilisateurId,
        chapitreId,
        type: "qcm",
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
        choixPossibles: exercice.choixPossibles,
      })),
    };
  }

  async repondre(
    utilisateurId: string,
    sessionId: string,
    input: ReponseQcmInput,
  ): Promise<CorrectionQcm> {
    const session = await this.sessionOuverte(utilisateurId, sessionId);
    const exercice = await this.prisma.exercice.findFirst({
      where: { id: input.exerciceId, chapitreId: session.chapitreId, type: "qcm" },
    });
    if (!exercice) {
      throw new NotFoundException("Cette question ne fait pas partie du QCM.");
    }

    const deja = await this.prisma.resultat.findFirst({
      where: { sessionId, exerciceId: exercice.id },
    });
    if (deja) {
      throw new ConflictException("Cette question a déjà reçu une réponse.");
    }

    const reponse = input.reponse.trim();
    const correct = reponse.length > 0 && reponse === exercice.bonneReponse.trim();

    const miseAJour = await this.prisma.$transaction(async (tx) => {
      await tx.resultat.create({
        data: {
          userId: utilisateurId,
          exerciceId: exercice.id,
          sessionId,
          reponseDonnee: reponse,
          correct,
          feedback: exercice.explication,
        },
      });
      const score = await tx.resultat.count({ where: { sessionId, correct: true } });
      const reponses = await tx.resultat.count({ where: { sessionId } });
      const terminee = reponses >= session.total;
      const suivante = await tx.session.update({
        where: { id: sessionId },
        data: { score, fin: terminee ? new Date() : null },
      });
      return { score: suivante.score, total: suivante.total, terminee };
    });

    return {
      correct,
      bonneReponse: exercice.bonneReponse,
      explication: exercice.explication,
      score: miseAJour.score,
      total: miseAJour.total,
      terminee: miseAJour.terminee,
    };
  }

  async terminer(utilisateurId: string, sessionId: string): Promise<BilanQcm> {
    const session = await this.prisma.session.findFirst({
      where: { id: sessionId, userId: utilisateurId, type: "qcm" },
    });
    if (!session) {
      throw new NotFoundException("Ce QCM est introuvable.");
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
      where: { id: sessionId, userId: utilisateurId, type: "qcm" },
    });
    if (!session) {
      throw new NotFoundException("Ce QCM est introuvable.");
    }
    if (session.fin) {
      throw new ConflictException("Ce QCM est terminé.");
    }
    return session;
  }
}
