-- DropForeignKey
ALTER TABLE "maintenancejob" DROP CONSTRAINT "maintenancejob_group_id_fkey";

-- AddForeignKey
ALTER TABLE "maintenancejob" ADD CONSTRAINT "maintenancejob_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "maintenancejob_group"("id") ON DELETE CASCADE ON UPDATE CASCADE;
