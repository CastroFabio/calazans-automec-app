/*
  Warnings:

  - You are about to drop the `Item_Service` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Service` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Item_Service";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Service";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Item_Maintenance" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "value_unit" DECIMAL NOT NULL,
    "subtotal" DECIMAL NOT NULL,
    "quantidade" INTEGER NOT NULL,
    "order_id" INTEGER,
    "maintenance_id" INTEGER,
    CONSTRAINT "Item_Maintenance_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "Order" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Item_Maintenance_maintenance_id_fkey" FOREIGN KEY ("maintenance_id") REFERENCES "Maintenance" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Maintenance" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "value_price" DECIMAL NOT NULL,
    "group_id" INTEGER,
    CONSTRAINT "Maintenance_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "Group" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Maintenance_name_key" ON "Maintenance"("name");
