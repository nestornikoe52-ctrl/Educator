import { Module } from "@nestjs/common";
import { ContenuController } from "./contenu.controller";
import { ContenuService } from "./contenu.service";

@Module({
  controllers: [ContenuController],
  providers: [ContenuService],
})
export class ContenuModule {}
