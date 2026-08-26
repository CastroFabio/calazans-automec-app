/*
  Warnings:

  - You are about to drop the column `value_unity` on the `item_maintenance` table. All the data in the column will be lost.
  - You are about to drop the column `value_unity` on the `item_material` table. All the data in the column will be lost.
  - You are about to alter the column `quantity` on the `item_material` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `Integer`.
  - You are about to drop the column `value_unit` on the `maintenancejob` table. All the data in the column will be lost.
  - Made the column `maintenance_id` on table `item_maintenance` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "item_maintenance" DROP COLUMN "value_unity",
ALTER COLUMN "maintenance_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "item_material" DROP COLUMN "value_unity",
ADD COLUMN     "value_unit" DOUBLE PRECISION NOT NULL DEFAULT 0,
ALTER COLUMN "quantity" SET DEFAULT 1,
ALTER COLUMN "quantity" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "maintenancejob" DROP COLUMN "value_unit";

-- AlterTable
ALTER TABLE "serviceorder" ADD COLUMN     "labor_cost" DOUBLE PRECISION NOT NULL DEFAULT 0;
