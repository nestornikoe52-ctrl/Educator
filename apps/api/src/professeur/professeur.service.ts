import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import type { CopieEleve, CorrectionProfesseurInput, MatiereCode, NiveauCode } from "@education-togo/shared";
import { PrismaService } from "../prisma/prisma.service";

const inclusionCopie = {
  utilisateur: { include: { classe: true } },
  exercice: { include: { chapitre: { include: { niveau: true, matiere: true } } } },
} as const;

type ResultatCopie = {
  id: string;
  date: Date;
  reponseDonnee: string;
  correct: boolean;
  revue: boolean;
  feedback: string | null;
  utilisateur: { nom: string; classe: { code: string } | null };
  exercice: {
    question: string;
    explication: string | null;
    bonneReponse: string;
    chapitre: {
      id: string;
      titre: string;
      niveau: { code: string; libelle: string };
      matiere: { code: string; nom: string };
    };
  };
};

function versCopie(resultat: ResultatCopie): CopieEleve {
  return {
    id: resultat.id,
    date: resultat.date.toISOString(),
    eleve: {
      nom: resultat.utilisateur.nom,
      classe: (resultat.utilisateur.classe?.code as NiveauCode | undefined) ?? null,
    },
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
    critere: resultat.exercice.bonneReponse,
    revue: resultat.revue,
    correct: resultat.correct,
    commentaire: resultat.feedback,
  };
}

@Injectable()
export class ProfesseurService {
  constructor(private readonly prisma: PrismaService) {}

  async copies(utilisateurId: string): Promise<CopieEleve[]> {
    await this.exigerProfesseur(utilisateurId);

    const resultats = await this.prisma.resultat.findMany({
      where: { exercice: { type: "ouverte" } },
      orderBy: { date: "desc" },
      take: 100,
      include: inclusionCopie,
    });

    return resultats.map(versCopie);
  }

  async corriger(
    utilisateurId: string,
    copieId: string,
    input: CorrectionProfesseurInput,
  ): Promise<CopieEleve> {
    await this.exigerProfesseur(utilisateurId);
    const existante = await this.prisma.resultat.findFirst({
      where: { id: copieId, exercice: { type: "ouverte" } },
    });
    if (!existante) {
      throw new NotFoundException("Cette copie est introuvable.");
    }

    const resultat = await this.prisma.resultat.update({
      where: { id: copieId },
      data: {
        revue: true,
        correct: input.correct,
        feedback: input.commentaire ? input.commentaire : null,
      },
      include: inclusionCopie,
    });

    return versCopie(resultat);
  }

  private async exigerProfesseur(utilisateurId: string) {
    const professeur = await this.prisma.utilisateur.findUnique({
      where: { id: utilisateurId },
    });
    if (!professeur || professeur.role !== "professeur") {
      throw new ForbiddenException("Cette page est réservée au professeur.");
    }
  }
}
