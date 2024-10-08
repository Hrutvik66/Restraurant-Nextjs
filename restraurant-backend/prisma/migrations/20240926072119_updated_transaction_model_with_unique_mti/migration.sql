/*
  Warnings:

  - A unique constraint covering the columns `[merchantTransactionId]` on the table `Transaction` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Transaction_merchantTransactionId_key" ON "Transaction"("merchantTransactionId");
