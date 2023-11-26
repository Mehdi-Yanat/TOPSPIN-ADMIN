-- AlterTable
ALTER TABLE "playoffTable" ADD COLUMN     "playoffId" INTEGER;

-- AddForeignKey
ALTER TABLE "playoffTable" ADD CONSTRAINT "playoffTable_playoffId_fkey" FOREIGN KEY ("playoffId") REFERENCES "playoff"("id") ON DELETE SET NULL ON UPDATE CASCADE;
