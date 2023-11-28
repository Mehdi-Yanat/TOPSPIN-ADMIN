/*
  Warnings:

  - You are about to drop the column `mobile` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `playoff` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `playoffTable` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "playoffTable" DROP CONSTRAINT "playoffTable_playoffId_fkey";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "mobile";

-- DropTable
DROP TABLE "playoff";

-- DropTable
DROP TABLE "playoffTable";
