import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import { reponseExerciceSchema } from "@education-togo/shared";
import type { ZodError } from "zod";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { ExercicesService } from "./exercices.service";

@Controller()
@UseGuards(JwtAuthGuard)
export class ExercicesController {
  constructor(private readonly exercices: ExercicesService) {}

  @Get("exercices/copies")
  mesCopies(@Req() request: { utilisateurId: string }) {
    return this.exercices.mesCopies(request.utilisateurId);
  }

  @Post("chapitres/:id/exercices")
  commencer(
    @Param("id", new ParseUUIDPipe()) id: string,
    @Req() request: { utilisateurId: string },
  ) {
    return this.exercices.commencer(request.utilisateurId, id);
  }

  @Post("exercices/:sessionId/reponses")
  repondre(
    @Param("sessionId", new ParseUUIDPipe()) sessionId: string,
    @Body() body: unknown,
    @Req() request: { utilisateurId: string },
  ) {
    const input = reponseExerciceSchema.safeParse(body);
    if (!input.success) {
      throw new BadRequestException(this.message(input.error));
    }
    return this.exercices.repondre(request.utilisateurId, sessionId, input.data);
  }

  @Post("exercices/:sessionId/terminer")
  terminer(
    @Param("sessionId", new ParseUUIDPipe()) sessionId: string,
    @Req() request: { utilisateurId: string },
  ) {
    return this.exercices.terminer(request.utilisateurId, sessionId);
  }

  private message(error: ZodError) {
    return error.issues[0]?.message ?? "Réponse invalide.";
  }
}
