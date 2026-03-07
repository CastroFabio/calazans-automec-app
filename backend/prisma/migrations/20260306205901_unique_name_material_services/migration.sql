/*
  Warnings:

  - Made the column `name` on table `Group` required. This step will fail if there are existing NULL values in that column.
  - Made the column `name` on table `Material` required. This step will fail if there are existing NULL values in that column.
  - Made the column `name` on table `Service` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Group" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);
INSERT INTO "new_Group" ("id", "name") SELECT "id", "name" FROM "Group";
DROP TABLE "Group";
ALTER TABLE "new_Group" RENAME TO "Group";
CREATE UNIQUE INDEX "Group_name_key" ON "Group"("name");
CREATE TABLE "new_Material" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "value_price" DECIMAL NOT NULL,
    "group_id" INTEGER,
    CONSTRAINT "Material_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "Group" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Material" ("group_id", "id", "name", "value_price") SELECT "group_id", "id", "name", "value_price" FROM "Material";
DROP TABLE "Material";
ALTER TABLE "new_Material" RENAME TO "Material";
CREATE UNIQUE INDEX "Material_name_key" ON "Material"("name");
CREATE TABLE "new_Service" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "value_price" DECIMAL NOT NULL,
    "group_id" INTEGER,
    CONSTRAINT "Service_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "Group" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Service" ("group_id", "id", "name", "value_price") SELECT "group_id", "id", "name", "value_price" FROM "Service";
DROP TABLE "Service";
ALTER TABLE "new_Service" RENAME TO "Service";
CREATE UNIQUE INDEX "Service_name_key" ON "Service"("name");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
