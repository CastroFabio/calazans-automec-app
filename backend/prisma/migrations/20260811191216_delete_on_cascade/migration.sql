-- DropForeignKey
ALTER TABLE "item_maintenance" DROP CONSTRAINT "item_maintenance_maintenance_id_fkey";

-- DropForeignKey
ALTER TABLE "item_maintenance" DROP CONSTRAINT "item_maintenance_serviceorder_id_fkey";

-- DropForeignKey
ALTER TABLE "item_material" DROP CONSTRAINT "item_material_serviceorder_id_fkey";

-- DropForeignKey
ALTER TABLE "material" DROP CONSTRAINT "material_group_id_fkey";

-- AddForeignKey
ALTER TABLE "material" ADD CONSTRAINT "material_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "material_group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "item_material" ADD CONSTRAINT "item_material_serviceorder_id_fkey" FOREIGN KEY ("serviceorder_id") REFERENCES "serviceorder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "item_maintenance" ADD CONSTRAINT "item_maintenance_serviceorder_id_fkey" FOREIGN KEY ("serviceorder_id") REFERENCES "serviceorder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "item_maintenance" ADD CONSTRAINT "item_maintenance_maintenance_id_fkey" FOREIGN KEY ("maintenance_id") REFERENCES "maintenancejob"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
