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
import { reponseQcmSchema } from "@education-togo/shared";
import type { ZodError } from "zod";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { QcmService } from "./qcm.service";

@Controller()
@UseGuards(JwtAuthGuard)
export class QcmController {
  constructor(private readonly qcm: QcmService) {}

  @Post("chapitres/:id/qcm")
  commencer(
    @Param("id", new ParseUUIDPipe()) id: string,
    @Req() request: { utilisateurId: string },
  ) {
    return this.qcm.commencer(request.utilisateurId, id);
  }

  @Post("qcm/:sessionId/reponses")
  repondre(
    @Param("sessionId", new ParseUUIDPipe()) sessionId: string,
    @Body() body: unknown,
    @Req() request: { utilisateurId: string },
  ) {
    const input = reponseQcmSchema.safeParse(body);
    if (!input.success) {
      throw new BadRequestException(this.message(input.error));
    }
    return this.qcm.repondre(request.utilisateurId, sessionId, input.data);
  }

  @Post("qcm/:sessionId/terminer")
  terminer(
    @Param("sessionId", new ParseUUIDPipe()) sessionId: string,
    @Req() request: { utilisateurId: string },
  ) {
    return this.qcm.terminer(request.utilisateurId, sessionId);
  }

  private message(error: ZodError) {
    return error.issues[0]?.message ?? "Réponse invalide.";
  }
}
