/*
  Warnings:

  - You are about to drop the column `playoffId` on the `playoff` table. All the data in the column will be lost.
  - Added the required column `playoffNumber` to the `playoff` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "playoff" DROP COLUMN "playoffId",
ADD COLUMN     "playoffNumber" INTEGER NOT NULL;
