/*
  Warnings:

  - Made the column `phone` on table `Inquiry` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Inquiry" ADD COLUMN     "contactTime" TEXT,
ADD COLUMN     "productName" TEXT,
ADD COLUMN     "quantity" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "referral" TEXT,
ADD COLUMN     "size" TEXT,
ALTER COLUMN "phone" SET NOT NULL;
