/*
  Warnings:

  - You are about to drop the column `reference` on the `item_material` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "item_material" DROP COLUMN "reference",
ADD COLUMN     "receipt" TEXT,
ADD COLUMN     "supplier" TEXT;
