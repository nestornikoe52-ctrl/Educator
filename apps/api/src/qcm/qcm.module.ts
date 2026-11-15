import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { QcmController } from "./qcm.controller";
import { QcmService } from "./qcm.service";

@Module({
  imports: [AuthModule],
  controllers: [QcmController],
  providers: [QcmService],
})
export class QcmModule {}
