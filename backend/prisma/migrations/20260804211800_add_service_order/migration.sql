/*
  Warnings:

  - Added the required column `customer_id` to the `serviceorder` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `serviceorder` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vehicle_id` to the `serviceorder` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "serviceorder" ADD COLUMN     "arrived_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "customer_id" INTEGER NOT NULL,
ADD COLUMN     "diagnosis" TEXT,
ADD COLUMN     "entry_km" DECIMAL(10,2) NOT NULL DEFAULT 0,
ADD COLUMN     "observation" TEXT,
ADD COLUMN     "priority" TEXT,
ADD COLUMN     "professional" TEXT,
ADD COLUMN     "status" TEXT NOT NULL,
ADD COLUMN     "value" DOUBLE PRECISION DEFAULT 0,
ADD COLUMN     "vehicle_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "serviceorder" ADD CONSTRAINT "serviceorder_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "serviceorder" ADD CONSTRAINT "serviceorder_vehicle_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "vehicle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
