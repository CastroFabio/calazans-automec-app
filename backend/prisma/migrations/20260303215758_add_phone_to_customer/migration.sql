/*
  Warnings:

  - You are about to drop the column `cell_number` on the `Customer` table. All the data in the column will be lost.
  - You are about to drop the column `tel_number` on the `Customer` table. All the data in the column will be lost.
  - Added the required column `phone` to the `Customer` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Customer" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "cell" INTEGER NOT NULL DEFAULT 0,
    "phone" INTEGER NOT NULL,
    "name" TEXT
);
INSERT INTO "new_Customer" ("id", "name") SELECT "id", "name" FROM "Customer";
DROP TABLE "Customer";
ALTER TABLE "new_Customer" RENAME TO "Customer";
CREATE UNIQUE INDEX "Customer_cell_key" ON "Customer"("cell");
CREATE UNIQUE INDEX "Customer_phone_key" ON "Customer"("phone");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
