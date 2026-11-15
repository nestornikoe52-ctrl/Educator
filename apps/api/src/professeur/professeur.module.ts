import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { ProfesseurController } from "./professeur.controller";
import { ProfesseurService } from "./professeur.service";

@Module({
  imports: [AuthModule],
  controllers: [ProfesseurController],
  providers: [ProfesseurService],
})
export class ProfesseurModule {}
