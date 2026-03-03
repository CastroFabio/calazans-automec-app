/*
  Warnings:

  - You are about to alter the column `cell_number` on the `Customer` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - You are about to alter the column `tel_number` on the `Customer` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Car" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "type" TEXT NOT NULL,
    "license_plate" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "color" TEXT NOT NULL,
    "km" INTEGER NOT NULL,
    "arrived_at" DATETIME NOT NULL,
    "customer_id" INTEGER,
    CONSTRAINT "Car_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "Customer" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Car" ("arrived_at", "brand", "color", "id", "km", "license_plate", "model", "type", "year") SELECT "arrived_at", "brand", "color", "id", "km", "license_plate", "model", "type", "year" FROM "Car";
DROP TABLE "Car";
ALTER TABLE "new_Car" RENAME TO "Car";
CREATE UNIQUE INDEX "Car_license_plate_key" ON "Car"("license_plate");
CREATE TABLE "new_Customer" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "cell_number" INTEGER NOT NULL,
    "tel_number" INTEGER NOT NULL,
    "name" TEXT
);
INSERT INTO "new_Customer" ("cell_number", "id", "name", "tel_number") SELECT "cell_number", "id", "name", "tel_number" FROM "Customer";
DROP TABLE "Customer";
ALTER TABLE "new_Customer" RENAME TO "Customer";
CREATE UNIQUE INDEX "Customer_cell_number_key" ON "Customer"("cell_number");
CREATE UNIQUE INDEX "Customer_tel_number_key" ON "Customer"("tel_number");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
