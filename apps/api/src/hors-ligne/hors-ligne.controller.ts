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
import { syncPartiesSchema } from "@education-togo/shared";
import type { ZodError } from "zod";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { HorsLigneService } from "./hors-ligne.service";

@Controller()
@UseGuards(JwtAuthGuard)
export class HorsLigneController {
  constructor(private readonly horsLigne: HorsLigneService) {}

  @Get("chapitres/:id/hors-ligne")
  pack(@Param("id", new ParseUUIDPipe()) id: string) {
    return this.horsLigne.pack(id);
  }

  @Post("sync/parties")
  synchroniser(@Body() body: unknown, @Req() request: { utilisateurId: string }) {
    const input = syncPartiesSchema.safeParse(body);
    if (!input.success) {
      throw new BadRequestException(this.message(input.error));
    }
    return this.horsLigne.synchroniser(request.utilisateurId, input.data);
  }

  private message(error: ZodError) {
    return error.issues[0]?.message ?? "Synchronisation invalide.";
  }
}
