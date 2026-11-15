import {
  BadRequestException,
  Body,
  Controller,
  Param,
  ParseUUIDPipe,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import { reponseTriviaSchema } from "@education-togo/shared";
import type { ZodError } from "zod";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { TriviaService } from "./trivia.service";

@Controller()
@UseGuards(JwtAuthGuard)
export class TriviaController {
  constructor(private readonly trivia: TriviaService) {}

  @Post("chapitres/:id/trivia")
  commencer(
    @Param("id", new ParseUUIDPipe()) id: string,
    @Req() request: { utilisateurId: string },
  ) {
    return this.trivia.commencer(request.utilisateurId, id);
  }

  @Post("trivia/:sessionId/reponses")
  repondre(
    @Param("sessionId", new ParseUUIDPipe()) sessionId: string,
    @Body() body: unknown,
    @Req() request: { utilisateurId: string },
  ) {
    const input = reponseTriviaSchema.safeParse(body);
    if (!input.success) {
      throw new BadRequestException(this.message(input.error));
    }
    return this.trivia.repondre(request.utilisateurId, sessionId, input.data);
  }

  @Post("trivia/:sessionId/terminer")
  terminer(
    @Param("sessionId", new ParseUUIDPipe()) sessionId: string,
    @Req() request: { utilisateurId: string },
  ) {
    return this.trivia.terminer(request.utilisateurId, sessionId);
  }

  private message(error: ZodError) {
    return error.issues[0]?.message ?? "Réponse invalide.";
  }
}
