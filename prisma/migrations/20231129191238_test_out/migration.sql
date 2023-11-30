-- AlterTable
ALTER TABLE "results" ADD COLUMN     "leaguesId" INTEGER;

-- AddForeignKey
ALTER TABLE "results" ADD CONSTRAINT "results_leaguesId_fkey" FOREIGN KEY ("leaguesId") REFERENCES "leagues"("id") ON DELETE SET NULL ON UPDATE CASCADE;
