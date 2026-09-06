/*
  Warnings:

  - You are about to drop the column `priority` on the `serviceorder` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "serviceorder" DROP COLUMN "priority",
ADD COLUMN     "paymentStatus" INTEGER DEFAULT 1,
ALTER COLUMN "status" DROP NOT NULL;
