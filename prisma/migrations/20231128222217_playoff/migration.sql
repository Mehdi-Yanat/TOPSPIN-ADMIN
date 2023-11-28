-- CreateTable
CREATE TABLE "playoff" (
    "id" SERIAL NOT NULL,
    "identifierName" TEXT NOT NULL,
    "playoffNumber" INTEGER NOT NULL,

    CONSTRAINT "playoff_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "playoffTable" (
    "id" SERIAL NOT NULL,
    "team" TEXT NOT NULL,
    "result" DOUBLE PRECISION NOT NULL,
    "playoffId" INTEGER,

    CONSTRAINT "playoffTable_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "playoffTable" ADD CONSTRAINT "playoffTable_playoffId_fkey" FOREIGN KEY ("playoffId") REFERENCES "playoff"("id") ON DELETE SET NULL ON UPDATE CASCADE;
