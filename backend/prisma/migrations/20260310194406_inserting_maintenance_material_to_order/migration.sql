/*
  Warnings:

  - You are about to drop the column `subtotal` on the `Item_Maintenance` table. All the data in the column will be lost.
  - You are about to drop the column `subtotal` on the `Item_Material` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Item_Maintenance" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "value_unit" DECIMAL NOT NULL,
    "quantidade" INTEGER NOT NULL,
    "order_id" INTEGER,
    "maintenance_id" INTEGER,
    CONSTRAINT "Item_Maintenance_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "Order" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Item_Maintenance_maintenance_id_fkey" FOREIGN KEY ("maintenance_id") REFERENCES "Maintenance" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Item_Maintenance" ("id", "maintenance_id", "order_id", "quantidade", "value_unit") SELECT "id", "maintenance_id", "order_id", "quantidade", "value_unit" FROM "Item_Maintenance";
DROP TABLE "Item_Maintenance";
ALTER TABLE "new_Item_Maintenance" RENAME TO "Item_Maintenance";
CREATE TABLE "new_Item_Material" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "value_unit" DECIMAL NOT NULL,
    "quantidade" INTEGER NOT NULL,
    "order_id" INTEGER,
    "material_id" INTEGER,
    CONSTRAINT "Item_Material_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "Order" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Item_Material_material_id_fkey" FOREIGN KEY ("material_id") REFERENCES "Material" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Item_Material" ("id", "material_id", "order_id", "quantidade", "value_unit") SELECT "id", "material_id", "order_id", "quantidade", "value_unit" FROM "Item_Material";
DROP TABLE "Item_Material";
ALTER TABLE "new_Item_Material" RENAME TO "Item_Material";
CREATE TABLE "new_Order" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "employer" TEXT NOT NULL,
    "priority" TEXT NOT NULL DEFAULT 'normal',
    "status" TEXT NOT NULL DEFAULT 'pending',
    "total_value" DECIMAL,
    "description" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "customer_id" INTEGER,
    "car_id" INTEGER,
    CONSTRAINT "Order_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "Customer" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Order_car_id_fkey" FOREIGN KEY ("car_id") REFERENCES "Car" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Order" ("car_id", "created_at", "customer_id", "description", "employer", "id", "priority", "status", "total_value", "updated_at") SELECT "car_id", "created_at", "customer_id", "description", "employer", "id", "priority", "status", "total_value", "updated_at" FROM "Order";
DROP TABLE "Order";
ALTER TABLE "new_Order" RENAME TO "Order";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
