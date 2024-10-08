/*
  Warnings:

  - You are about to drop the column `paymentId` on the `Transaction` table. All the data in the column will be lost.
  - Added the required column `merchantTransactionId` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Transaction_orderId_key";

-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "paymentId",
ADD COLUMN     "merchantTransactionId" TEXT NOT NULL,
ADD COLUMN     "paymentMethod" TEXT,
ADD COLUMN     "phonepeTransactionId" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
