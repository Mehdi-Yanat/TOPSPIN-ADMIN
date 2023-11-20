-- CreateTable
CREATE TABLE "classificationPoints" (
    "id" SERIAL NOT NULL,
    "identifierName" TEXT NOT NULL,

    CONSTRAINT "classificationPoints_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "classificationPointsTable" (
    "id" SERIAL NOT NULL,
    "gender" TEXT NOT NULL,
    "fullname" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "point" INTEGER NOT NULL,
    "classificationPointsId" INTEGER,

    CONSTRAINT "classificationPointsTable_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "matchSchedule" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "day" TEXT NOT NULL,
    "hour" TEXT NOT NULL,
    "team1" TEXT NOT NULL,
    "team2" TEXT NOT NULL,

    CONSTRAINT "matchSchedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "team1MatchResult" (
    "id" SERIAL NOT NULL,
    "team" TEXT NOT NULL,
    "result" INTEGER NOT NULL,
    "matchScheduleId" INTEGER,

    CONSTRAINT "team1MatchResult_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "team2MatchResult" (
    "id" SERIAL NOT NULL,
    "team" TEXT NOT NULL,
    "result" INTEGER NOT NULL,
    "matchScheduleId" INTEGER,

    CONSTRAINT "team2MatchResult_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "classificationPointsTable" ADD CONSTRAINT "classificationPointsTable_classificationPointsId_fkey" FOREIGN KEY ("classificationPointsId") REFERENCES "classificationPoints"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team1MatchResult" ADD CONSTRAINT "team1MatchResult_matchScheduleId_fkey" FOREIGN KEY ("matchScheduleId") REFERENCES "matchSchedule"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team2MatchResult" ADD CONSTRAINT "team2MatchResult_matchScheduleId_fkey" FOREIGN KEY ("matchScheduleId") REFERENCES "matchSchedule"("id") ON DELETE SET NULL ON UPDATE CASCADE;
