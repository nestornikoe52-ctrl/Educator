ALTER TABLE "sessions" ADD COLUMN "cle_client" UUID;

CREATE UNIQUE INDEX "sessions_cle_client_key" ON "sessions"("cle_client");
