import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { HorsLigneController } from "./hors-ligne.controller";
import { HorsLigneService } from "./hors-ligne.service";

@Module({
  imports: [AuthModule],
  controllers: [HorsLigneController],
  providers: [HorsLigneService],
})
export class HorsLigneModule {}
