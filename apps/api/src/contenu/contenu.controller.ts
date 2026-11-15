import { Controller, Get, Param, Query } from "@nestjs/common";
import { ContenuService } from "./contenu.service";

@Controller()
export class ContenuController {
  constructor(private readonly contenu: ContenuService) {}

  @Get("niveaux")
  niveaux() {
    return this.contenu.niveaux();
  }

  @Get("matieres")
  matieres() {
    return this.contenu.matieres();
  }

  @Get("chapitres")
  chapitres(@Query("niveau") niveau = "", @Query("matiere") matiere = "") {
    return this.contenu.chapitres(niveau, matiere);
  }

  @Get("chapitres/:id")
  chapitre(@Param("id") id: string) {
    return this.contenu.chapitre(id);
  }
}
