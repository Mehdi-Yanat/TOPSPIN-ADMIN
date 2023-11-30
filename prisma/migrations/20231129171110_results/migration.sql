-- CreateTable
CREATE TABLE "results" (
    "id" SERIAL NOT NULL,
    "identifierName" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "results_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "matches" (
    "id" SERIAL NOT NULL,
    "hour" TEXT NOT NULL,
    "matchCode" TEXT NOT NULL,
    "resultsId" INTEGER,

    CONSTRAINT "matches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "team1" (
    "id" SERIAL NOT NULL,
    "teamCode" TEXT NOT NULL,
    "teamName" TEXT NOT NULL,
    "set1" INTEGER NOT NULL,
    "set2" INTEGER NOT NULL,
    "set3" INTEGER NOT NULL,
    "matchScore" INTEGER NOT NULL,
    "matchPoint" INTEGER NOT NULL,
    "teamPoint" INTEGER NOT NULL,
    "matchesId" INTEGER,

    CONSTRAINT "team1_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "team2" (
    "id" SERIAL NOT NULL,
    "teamCode" TEXT NOT NULL,
    "teamName" TEXT NOT NULL,
    "set1" INTEGER NOT NULL,
    "set2" INTEGER NOT NULL,
    "set3" INTEGER NOT NULL,
    "matchScore" INTEGER NOT NULL,
    "matchPoint" INTEGER NOT NULL,
    "teamPoint" INTEGER NOT NULL,
    "matchesId" INTEGER,

    CONSTRAINT "team2_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "player" (
    "id" SERIAL NOT NULL,
    "playerName" TEXT NOT NULL,
    "categorie" TEXT NOT NULL,
    "team1Id" INTEGER,
    "team2Id" INTEGER,

    CONSTRAINT "player_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "matches" ADD CONSTRAINT "matches_resultsId_fkey" FOREIGN KEY ("resultsId") REFERENCES "results"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team1" ADD CONSTRAINT "team1_matchesId_fkey" FOREIGN KEY ("matchesId") REFERENCES "matches"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team2" ADD CONSTRAINT "team2_matchesId_fkey" FOREIGN KEY ("matchesId") REFERENCES "matches"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "player" ADD CONSTRAINT "player_team1Id_fkey" FOREIGN KEY ("team1Id") REFERENCES "team1"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "player" ADD CONSTRAINT "player_team2Id_fkey" FOREIGN KEY ("team2Id") REFERENCES "team2"("id") ON DELETE SET NULL ON UPDATE CASCADE;
