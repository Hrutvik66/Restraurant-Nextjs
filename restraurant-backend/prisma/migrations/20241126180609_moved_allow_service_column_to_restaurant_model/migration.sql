/*
  Warnings:

  - You are about to drop the column `allowService` on the `Owner` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Owner" DROP COLUMN "allowService";

-- AlterTable
ALTER TABLE "Restaurant" ADD COLUMN     "allowService" BOOLEAN NOT NULL DEFAULT false;
