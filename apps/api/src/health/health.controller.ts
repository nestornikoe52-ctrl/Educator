import { Controller, Get } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Controller("health")
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async getHealth() {
    const [niveaux, matieres] = await Promise.all([
      this.prisma.niveau.findMany({ orderBy: { ordre: "asc" } }),
      this.prisma.matiere.findMany({ orderBy: { code: "asc" } }),
    ]);

    return {
      status: "ok",
      service: "education-togo-api",
      database: "ok",
      niveaux: niveaux.map((niveau) => niveau.code),
      matieres: matieres.map((matiere) => matiere.code),
    };
  }
}
