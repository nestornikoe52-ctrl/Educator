import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "./auth/auth.module";
import { ContenuModule } from "./contenu/contenu.module";
import { ExercicesModule } from "./exercices/exercices.module";
import { HorsLigneModule } from "./hors-ligne/hors-ligne.module";
import { HealthModule } from "./health/health.module";
import { PrismaModule } from "./prisma/prisma.module";
import { ProfesseurModule } from "./professeur/professeur.module";
import { QcmModule } from "./qcm/qcm.module";
import { TriviaModule } from "./trivia/trivia.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [".env", "../../.env"],
    }),
    PrismaModule,
    AuthModule,
    ContenuModule,
    TriviaModule,
    QcmModule,
    ExercicesModule,
    HorsLigneModule,
    ProfesseurModule,
    HealthModule,
  ],
})
export class AppModule {}
