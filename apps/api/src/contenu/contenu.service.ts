import { Injectable, NotFoundException } from "@nestjs/common";
import type { ChapitrePublie, MatiereCode, NiveauCode } from "@education-togo/shared";
import { MATIERES, NIVEAUX } from "@education-togo/shared";
import { PrismaService } from "../prisma/prisma.service";

const inclusion = {
  niveau: true,
  matiere: true,
} as const;

@Injectable()
export class ContenuService {
  constructor(private readonly prisma: PrismaService) {}

  async niveaux() {
    const lignes = await this.prisma.niveau.findMany({ orderBy: { ordre: "asc" } });
    return lignes.map((niveau) => ({
      id: niveau.id,
      code: niveau.code as NiveauCode,
      libelle: niveau.libelle,
      ordre: niveau.ordre,
    }));
  }

  async matieres() {
    const lignes = await this.prisma.matiere.findMany({ orderBy: { nom: "asc" } });
    return lignes.map((matiere) => ({
      id: matiere.id,
      code: matiere.code as MatiereCode,
      nom: matiere.nom,
    }));
  }

  async chapitres(niveauCode: string, matiereCode: string): Promise<ChapitrePublie[]> {
    this.verifierCodes(niveauCode, matiereCode);
    const lignes = await this.prisma.chapitre.findMany({
      where: { niveau: { code: niveauCode }, matiere: { code: matiereCode } },
      orderBy: { ordre: "asc" },
      include: inclusion,
    });
    return lignes.map((chapitre) => this.publier(chapitre));
  }

  async chapitre(id: string): Promise<ChapitrePublie> {
    const chapitre = await this.prisma.chapitre.findUnique({
      where: { id },
      include: inclusion,
    });
    if (!chapitre) {
      throw new NotFoundException("Ce chapitre n’existe pas.");
    }
    return this.publier(chapitre);
  }

  private verifierCodes(niveauCode: string, matiereCode: string) {
    const niveauConnu = NIVEAUX.some((niveau) => niveau.code === niveauCode);
    const matiereConnue = MATIERES.some((matiere) => matiere.code === matiereCode);
    if (!niveauConnu || !matiereConnue) {
      throw new NotFoundException("Ce niveau ou cette matière n’existe pas.");
    }
  }

  private publier(chapitre: {
    id: string;
    titre: string;
    ordre: number;
    resumeCours: string;
    niveau: { code: string; libelle: string };
    matiere: { code: string; nom: string };
  }): ChapitrePublie {
    return {
      id: chapitre.id,
      titre: chapitre.titre,
      ordre: chapitre.ordre,
      resumeCours: chapitre.resumeCours,
      niveau: {
        code: chapitre.niveau.code as NiveauCode,
        libelle: chapitre.niveau.libelle,
      },
      matiere: {
        code: chapitre.matiere.code as MatiereCode,
        nom: chapitre.matiere.nom,
      },
    };
  }
}
