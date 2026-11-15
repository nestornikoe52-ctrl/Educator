import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import { connexionSchema, inscriptionSchema } from "@education-togo/shared";
import type { ZodError } from "zod";
import { AuthService } from "./auth.service";
import { JwtAuthGuard } from "./jwt-auth.guard";

@Controller("auth")
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post("inscription")
  inscrire(@Body() body: unknown) {
    const input = inscriptionSchema.safeParse(body);
    if (!input.success) {
      throw new BadRequestException(this.message(input.error));
    }
    return this.auth.inscrire(input.data);
  }

  @Post("connexion")
  connecter(@Body() body: unknown) {
    const input = connexionSchema.safeParse(body);
    if (!input.success) {
      throw new BadRequestException(this.message(input.error));
    }
    return this.auth.connecter(input.data);
  }

  @Get("moi")
  @UseGuards(JwtAuthGuard)
  moi(@Req() request: { utilisateurId: string }) {
    return this.auth.profil(request.utilisateurId);
  }

  @Get("historique")
  @UseGuards(JwtAuthGuard)
  historique(@Req() request: { utilisateurId: string }) {
    return this.auth.historique(request.utilisateurId);
  }

  private message(error: ZodError) {
    return error.issues[0]?.message ?? "Les informations envoyées sont incomplètes.";
  }
}
