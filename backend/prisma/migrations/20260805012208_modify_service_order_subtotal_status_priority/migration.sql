/*
  Warnings:

  - You are about to drop the column `value` on the `serviceorder` table. All the data in the column will be lost.
  - The `priority` column on the `serviceorder` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "serviceorder" DROP COLUMN "value",
ADD COLUMN     "subtotal" DOUBLE PRECISION NOT NULL DEFAULT 0,
DROP COLUMN "priority",
ADD COLUMN     "priority" INTEGER;
