/*
  Warnings:

  - You are about to drop the `Costumer` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Costumer";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Customer" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "cell_number" TEXT NOT NULL,
    "tel_number" TEXT NOT NULL,
    "name" TEXT
);

-- CreateIndex
CREATE UNIQUE INDEX "Customer_cell_number_key" ON "Customer"("cell_number");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_tel_number_key" ON "Customer"("tel_number");
