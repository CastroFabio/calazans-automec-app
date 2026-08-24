-- AlterTable
ALTER TABLE "item_material" ADD COLUMN     "itemMaintenance_id" INTEGER;

-- AddForeignKey
ALTER TABLE "item_material" ADD CONSTRAINT "item_material_itemMaintenance_id_fkey" FOREIGN KEY ("itemMaintenance_id") REFERENCES "item_maintenance"("id") ON DELETE CASCADE ON UPDATE CASCADE;
