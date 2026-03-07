-- CreateTable
CREATE TABLE "Item_Service" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "value_unit" DECIMAL NOT NULL,
    "subtotal" DECIMAL NOT NULL,
    "quantidade" INTEGER NOT NULL,
    "order_id" INTEGER,
    "service_id" INTEGER,
    CONSTRAINT "Item_Service_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "Order" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Item_Service_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "Service" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Item_Material" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "value_unit" DECIMAL NOT NULL,
    "subtotal" DECIMAL NOT NULL,
    "quantidade" INTEGER NOT NULL,
    "order_id" INTEGER,
    "material_id" INTEGER,
    CONSTRAINT "Item_Material_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "Order" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Item_Material_material_id_fkey" FOREIGN KEY ("material_id") REFERENCES "Material" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Service" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT,
    "value_price" DECIMAL NOT NULL,
    "group_id" INTEGER,
    CONSTRAINT "Service_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "Group" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Material" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT,
    "value_price" DECIMAL NOT NULL,
    "group_id" INTEGER,
    CONSTRAINT "Material_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "Group" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Group" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT
);
