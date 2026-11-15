-- CreateEnum
CREATE TYPE "type_exercice" AS ENUM ('ouverte', 'qcm', 'trivia');

-- CreateEnum
CREATE TYPE "type_session" AS ENUM ('exercices', 'qcm', 'trivia');

-- CreateTable
CREATE TABLE "niveaux" (
    "id" UUID NOT NULL,
    "code" TEXT NOT NULL,
    "libelle" TEXT NOT NULL,
    "ordre" INTEGER NOT NULL,

    CONSTRAINT "niveaux_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "matieres" (
    "id" UUID NOT NULL,
    "code" TEXT NOT NULL,
    "nom" TEXT NOT NULL,

    CONSTRAINT "matieres_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "utilisateurs" (
    "id" UUID NOT NULL,
    "nom" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "mot_de_passe_hash" TEXT NOT NULL,
    "niveau_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "utilisateurs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "matieres_suivies" (
    "utilisateur_id" UUID NOT NULL,
    "matiere_id" UUID NOT NULL,

    CONSTRAINT "matieres_suivies_pkey" PRIMARY KEY ("utilisateur_id","matiere_id")
);

-- CreateTable
CREATE TABLE "chapitres" (
    "id" UUID NOT NULL,
    "titre" TEXT NOT NULL,
    "ordre" INTEGER NOT NULL,
    "resume_cours" TEXT NOT NULL DEFAULT '',
    "niveau_id" UUID NOT NULL,
    "matiere_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "chapitres_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exercices" (
    "id" UUID NOT NULL,
    "chapitre_id" UUID NOT NULL,
    "ordre" INTEGER NOT NULL,
    "question" TEXT NOT NULL,
    "type" "type_exercice" NOT NULL,
    "choix_possibles" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "bonne_reponse" TEXT NOT NULL,
    "explication" TEXT,
    "duree_secondes" INTEGER,

    CONSTRAINT "exercices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "chapitre_id" UUID NOT NULL,
    "type" "type_session" NOT NULL,
    "score" INTEGER NOT NULL DEFAULT 0,
    "total" INTEGER NOT NULL DEFAULT 0,
    "debut" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fin" TIMESTAMP(3),

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "resultats" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "exercice_id" UUID NOT NULL,
    "session_id" UUID,
    "reponse_donnee" TEXT NOT NULL,
    "correct" BOOLEAN NOT NULL,
    "feedback" TEXT,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "resultats_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "niveaux_code_key" ON "niveaux"("code");

-- CreateIndex
CREATE UNIQUE INDEX "niveaux_ordre_key" ON "niveaux"("ordre");

-- CreateIndex
CREATE UNIQUE INDEX "matieres_code_key" ON "matieres"("code");

-- CreateIndex
CREATE UNIQUE INDEX "utilisateurs_email_key" ON "utilisateurs"("email");

-- CreateIndex
CREATE INDEX "chapitres_niveau_id_matiere_id_idx" ON "chapitres"("niveau_id", "matiere_id");

-- CreateIndex
CREATE UNIQUE INDEX "chapitres_niveau_id_matiere_id_ordre_key" ON "chapitres"("niveau_id", "matiere_id", "ordre");

-- CreateIndex
CREATE INDEX "exercices_chapitre_id_type_idx" ON "exercices"("chapitre_id", "type");

-- CreateIndex
CREATE UNIQUE INDEX "exercices_chapitre_id_ordre_key" ON "exercices"("chapitre_id", "ordre");

-- CreateIndex
CREATE INDEX "sessions_user_id_chapitre_id_idx" ON "sessions"("user_id", "chapitre_id");

-- CreateIndex
CREATE INDEX "resultats_user_id_exercice_id_idx" ON "resultats"("user_id", "exercice_id");

-- CreateIndex
CREATE INDEX "resultats_session_id_idx" ON "resultats"("session_id");

-- AddForeignKey
ALTER TABLE "utilisateurs" ADD CONSTRAINT "utilisateurs_niveau_id_fkey" FOREIGN KEY ("niveau_id") REFERENCES "niveaux"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matieres_suivies" ADD CONSTRAINT "matieres_suivies_utilisateur_id_fkey" FOREIGN KEY ("utilisateur_id") REFERENCES "utilisateurs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matieres_suivies" ADD CONSTRAINT "matieres_suivies_matiere_id_fkey" FOREIGN KEY ("matiere_id") REFERENCES "matieres"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chapitres" ADD CONSTRAINT "chapitres_niveau_id_fkey" FOREIGN KEY ("niveau_id") REFERENCES "niveaux"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chapitres" ADD CONSTRAINT "chapitres_matiere_id_fkey" FOREIGN KEY ("matiere_id") REFERENCES "matieres"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exercices" ADD CONSTRAINT "exercices_chapitre_id_fkey" FOREIGN KEY ("chapitre_id") REFERENCES "chapitres"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "utilisateurs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_chapitre_id_fkey" FOREIGN KEY ("chapitre_id") REFERENCES "chapitres"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resultats" ADD CONSTRAINT "resultats_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "utilisateurs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resultats" ADD CONSTRAINT "resultats_exercice_id_fkey" FOREIGN KEY ("exercice_id") REFERENCES "exercices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resultats" ADD CONSTRAINT "resultats_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "sessions"("id") ON DELETE SET NULL ON UPDATE CASCADE;
