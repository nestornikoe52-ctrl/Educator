import { BadRequestException, Body, Controller, Get, Param, ParseUUIDPipe, Patch, Req, UseGuards } from "@nestjs/common";
import { correctionProfesseurSchema } from "@education-togo/shared";
import type { ZodError } from "zod";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { ProfesseurService } from "./professeur.service";

@Controller("professeur")
export class ProfesseurController {
  constructor(private readonly professeur: ProfesseurService) {}

  @Get("copies")
  @UseGuards(JwtAuthGuard)
  copies(@Req() request: { utilisateurId: string }) {
    return this.professeur.copies(request.utilisateurId);
  }

  @Patch("copies/:id")
  @UseGuards(JwtAuthGuard)
  corriger(
    @Param("id", new ParseUUIDPipe()) id: string,
    @Body() body: unknown,
    @Req() request: { utilisateurId: string },
  ) {
    const input = correctionProfesseurSchema.safeParse(body);
    if (!input.success) {
      throw new BadRequestException(this.message(input.error));
    }
    return this.professeur.corriger(request.utilisateurId, id, input.data);
  }

  private message(error: ZodError) {
    return error.issues[0]?.message ?? "La correction est incomplète.";
  }
}
