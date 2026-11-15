import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { ExercicesController } from "./exercices.controller";
import { ExercicesService } from "./exercices.service";

@Module({
  imports: [AuthModule],
  controllers: [ExercicesController],
  providers: [ExercicesService],
})
export class ExercicesModule {}
