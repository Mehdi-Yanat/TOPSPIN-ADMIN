-- CreateTable
CREATE TABLE "playoff" (
    "id" SERIAL NOT NULL,
    "identifierName" TEXT NOT NULL,
    "playoffId" INTEGER NOT NULL,

    CONSTRAINT "playoff_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "playoffTable" (
    "id" SERIAL NOT NULL,
    "team" TEXT NOT NULL,
    "result" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "playoffTable_pkey" PRIMARY KEY ("id")
);
