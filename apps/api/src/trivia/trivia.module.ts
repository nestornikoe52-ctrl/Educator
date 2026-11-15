import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { TriviaController } from "./trivia.controller";
import { TriviaService } from "./trivia.service";

@Module({
  imports: [AuthModule],
  controllers: [TriviaController],
  providers: [TriviaService],
})
export class TriviaModule {}
