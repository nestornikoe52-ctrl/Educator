import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import {
  reponseJuste,
  type PackChapitre,
  type ResultatSync,
  type SyncPartiesInput,
} from "@education-togo/shared";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class HorsLigneService {
  constructor(private readonly prisma: PrismaService) {}

  async pack(chapitreId: string): Promise<PackChapitre> {
    const chapitre = await this.prisma.chapitre.findUnique({
      where: { id: chapitreId },
      include: { niveau: true, matiere: true, exercices: { orderBy: { ordre: "asc" } } },
    });
    if (!chapitre) {
      throw new NotFoundException("Ce chapitre n’existe pas.");
    }

    const versQuestion = (exercice: (typeof chapitre.exercices)[number]) => ({
      id: exercice.id,
      ordre: exercice.ordre,
      question: exercice.question,
      choixPossibles: exercice.choixPossibles,
      dureeSecondes: exercice.dureeSecondes,
      bonneReponse: exercice.bonneReponse,
      explication: exercice.explication,
    });
    const trivia = chapitre.exercices.filter((exercice) => exercice.type === "trivia").map(versQuestion);
    const qcm = chapitre.exercices.filter((exercice) => exercice.type === "qcm").map(versQuestion);
    if (trivia.length === 0 && qcm.length === 0) {
      throw new NotFoundException("Ce chapitre n’a rien à télécharger.");
    }

    return {
      chapitreId: chapitre.id,
      titre: chapitre.titre,
      niveauCode: chapitre.niveau.code,
      matiereNom: chapitre.matiere.nom,
      trivia,
      qcm,
    };
  }

  async synchroniser(utilisateurId: string, input: SyncPartiesInput): Promise<{ resultats: ResultatSync[] }> {
    const resultats: ResultatSync[] = [];
    for (const partie of input.parties) {
      resultats.push(await this.unePartie(utilisateurId, partie));
    }
    return { resultats };
  }

  private async unePartie(
    utilisateurId: string,
    partie: SyncPartiesInput["parties"][number],
  ): Promise<ResultatSync> {
    const existante = await this.prisma.session.findUnique({ where: { cleClient: partie.cleClient } });
    if (existante) {
      if (existante.userId !== utilisateurId) {
        throw new ConflictException("Cette partie appartient à un autre compte.");
      }
      return {
        cleClient: partie.cleClient,
        score: existante.score,
        total: existante.total,
        statut: "deja",
      };
    }

    const vues = new Set<string>();
    const reponses = partie.reponses.filter((reponse) => {
      if (vues.has(reponse.exerciceId)) {
        return false;
      }
      vues.add(reponse.exerciceId);
      return true;
    });
    const exercices = await this.prisma.exercice.findMany({
      where: {
        chapitreId: partie.chapitreId,
        type: partie.type,
        id: { in: reponses.map((reponse) => reponse.exerciceId) },
      },
    });
    if (exercices.length === 0) {
      return { cleClient: partie.cleClient, score: 0, total: 0, statut: "ignoree" };
    }

    const session = await this.prisma.$transaction(async (tx) => {
      const creee = await tx.session.create({
        data: {
          userId: utilisateurId,
          chapitreId: partie.chapitreId,
          type: partie.type,
          total: exercices.length,
          score: 0,
          fin: new Date(),
          cleClient: partie.cleClient,
        },
      });
      let score = 0;
      for (const exercice of exercices) {
        const donnee = reponses.find((reponse) => reponse.exerciceId === exercice.id);
        const correct = reponseJuste(exercice.bonneReponse, donnee?.reponse ?? "");
        if (correct) {
          score += 1;
        }
        await tx.resultat.create({
          data: {
            userId: utilisateurId,
            exerciceId: exercice.id,
            sessionId: creee.id,
            reponseDonnee: (donnee?.reponse ?? "").trim(),
            correct,
            feedback: exercice.explication,
          },
        });
      }
      return tx.session.update({ where: { id: creee.id }, data: { score } });
    });

    return {
      cleClient: partie.cleClient,
      score: session.score,
      total: session.total,
      statut: "creee",
    };
  }
}
