/*
  Warnings:

  - Added the required column `subtotal` to the `Item_Maintenance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subtotal` to the `Item_Material` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Item_Maintenance" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "value_unit" DECIMAL NOT NULL,
    "quantidade" INTEGER NOT NULL,
    "subtotal" DECIMAL NOT NULL,
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
    "subtotal" DECIMAL NOT NULL,
    "order_id" INTEGER,
    "material_id" INTEGER,
    CONSTRAINT "Item_Material_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "Order" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Item_Material_material_id_fkey" FOREIGN KEY ("material_id") REFERENCES "Material" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Item_Material" ("id", "material_id", "order_id", "quantidade", "value_unit") SELECT "id", "material_id", "order_id", "quantidade", "value_unit" FROM "Item_Material";
DROP TABLE "Item_Material";
ALTER TABLE "new_Item_Material" RENAME TO "Item_Material";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
