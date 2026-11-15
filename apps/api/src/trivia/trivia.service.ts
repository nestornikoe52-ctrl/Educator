import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import type { BilanTrivia, CorrectionTrivia, PartieTrivia, ReponseTriviaInput } from "@education-togo/shared";
import { PrismaService } from "../prisma/prisma.service";

const DUREE_DEFAUT = 20;

@Injectable()
export class TriviaService {
  constructor(private readonly prisma: PrismaService) {}

  async commencer(utilisateurId: string, chapitreId: string): Promise<PartieTrivia> {
    const chapitre = await this.prisma.chapitre.findUnique({ where: { id: chapitreId } });
    if (!chapitre) {
      throw new NotFoundException("Ce chapitre n’existe pas.");
    }

    const exercices = await this.prisma.exercice.findMany({
      where: { chapitreId, type: "trivia" },
      orderBy: { ordre: "asc" },
    });
    if (exercices.length === 0) {
      throw new NotFoundException("Ce chapitre n’a pas encore de trivia.");
    }

    const session = await this.prisma.session.create({
      data: {
        userId: utilisateurId,
        chapitreId,
        type: "trivia",
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
        dureeSecondes: exercice.dureeSecondes ?? DUREE_DEFAUT,
      })),
    };
  }

  async repondre(
    utilisateurId: string,
    sessionId: string,
    input: ReponseTriviaInput,
  ): Promise<CorrectionTrivia> {
    const session = await this.sessionOuverte(utilisateurId, sessionId);
    const exercice = await this.prisma.exercice.findFirst({
      where: { id: input.exerciceId, chapitreId: session.chapitreId, type: "trivia" },
    });
    if (!exercice) {
      throw new NotFoundException("Cette question ne fait pas partie de la partie.");
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

  async terminer(utilisateurId: string, sessionId: string): Promise<BilanTrivia> {
    const session = await this.prisma.session.findFirst({
      where: { id: sessionId, userId: utilisateurId, type: "trivia" },
    });
    if (!session) {
      throw new NotFoundException("Cette partie est introuvable.");
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
      where: { id: sessionId, userId: utilisateurId, type: "trivia" },
    });
    if (!session) {
      throw new NotFoundException("Cette partie est introuvable.");
    }
    if (session.fin) {
      throw new ConflictException("Cette partie est terminée.");
    }
    return session;
  }
}
