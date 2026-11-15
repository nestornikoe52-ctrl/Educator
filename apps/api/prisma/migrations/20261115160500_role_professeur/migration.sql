-- CreateEnum
CREATE TYPE "role_utilisateur" AS ENUM ('eleve', 'professeur');

-- AlterTable
ALTER TABLE "utilisateurs" ADD COLUMN "role" "role_utilisateur" NOT NULL DEFAULT 'eleve';

-- AlterTable
ALTER TABLE "utilisateurs" ALTER COLUMN "niveau_id" DROP NOT NULL;
