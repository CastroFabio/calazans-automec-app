/*
  Warnings:

  - You are about to alter the column `value_unit` on the `item_material` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(10,2)`.
  - You are about to alter the column `subtotal` on the `serviceorder` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(10,2)`.
  - You are about to alter the column `paid` on the `serviceorder` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(10,2)`.
  - You are about to alter the column `labor_cost` on the `serviceorder` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(10,2)`.

*/
-- AlterTable
ALTER TABLE "item_material" ALTER COLUMN "value_unit" SET DATA TYPE DECIMAL(10,2);

-- AlterTable
ALTER TABLE "serviceorder" ALTER COLUMN "subtotal" SET DATA TYPE DECIMAL(10,2),
ALTER COLUMN "paid" SET DATA TYPE DECIMAL(10,2),
ALTER COLUMN "labor_cost" SET DATA TYPE DECIMAL(10,2);
