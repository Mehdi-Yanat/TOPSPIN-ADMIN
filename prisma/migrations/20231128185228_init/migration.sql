-- AlterTable
ALTER TABLE "classificationPoints" ADD COLUMN     "leaguesId" INTEGER;

-- AlterTable
ALTER TABLE "matchSchedule" ADD COLUMN     "leaguesId" INTEGER;

-- CreateTable
CREATE TABLE "leagues" (
    "id" SERIAL NOT NULL,
    "leagueName" TEXT NOT NULL,

    CONSTRAINT "leagues_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "playersGroup" (
    "id" SERIAL NOT NULL,
    "identifierGroup" TEXT NOT NULL,
    "leaguesId" INTEGER,

    CONSTRAINT "playersGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "players" (
    "id" SERIAL NOT NULL,
    "playerName" TEXT NOT NULL,
    "categories" TEXT NOT NULL,
    "playersGroupId" INTEGER,

    CONSTRAINT "players_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "playersGroup" ADD CONSTRAINT "playersGroup_leaguesId_fkey" FOREIGN KEY ("leaguesId") REFERENCES "leagues"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "players" ADD CONSTRAINT "players_playersGroupId_fkey" FOREIGN KEY ("playersGroupId") REFERENCES "playersGroup"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "classificationPoints" ADD CONSTRAINT "classificationPoints_leaguesId_fkey" FOREIGN KEY ("leaguesId") REFERENCES "leagues"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matchSchedule" ADD CONSTRAINT "matchSchedule_leaguesId_fkey" FOREIGN KEY ("leaguesId") REFERENCES "leagues"("id") ON DELETE SET NULL ON UPDATE CASCADE;
