-- CreateTable
CREATE TABLE "vehicle" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "license_plate" TEXT NOT NULL,
    "brand" TEXT,
    "model" TEXT,
    "customer_id" INTEGER,

    CONSTRAINT "vehicle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "material_group" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "group" TEXT NOT NULL,

    CONSTRAINT "material_group_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "material" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "group_id" INTEGER NOT NULL,

    CONSTRAINT "material_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "maintenancejob_group" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "group" TEXT NOT NULL,

    CONSTRAINT "maintenancejob_group_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "maintenancejob" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "group_id" INTEGER NOT NULL,
    "value_unit" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "maintenancejob_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "serviceorder" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "serviceorder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "item_material" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "quantity" DECIMAL(10,2) NOT NULL,
    "value_unity" DOUBLE PRECISION NOT NULL,
    "serviceorder_id" INTEGER NOT NULL,
    "material_id" INTEGER NOT NULL,
    "reference" TEXT,

    CONSTRAINT "item_material_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "item_maintenance" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "value_unity" DOUBLE PRECISION NOT NULL,
    "serviceorder_id" INTEGER NOT NULL,
    "maintenance_id" INTEGER,
    "description" TEXT,

    CONSTRAINT "item_maintenance_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "vehicle_license_plate_key" ON "vehicle"("license_plate");

-- CreateIndex
CREATE UNIQUE INDEX "material_group_group_key" ON "material_group"("group");

-- CreateIndex
CREATE UNIQUE INDEX "material_name_key" ON "material"("name");

-- CreateIndex
CREATE UNIQUE INDEX "maintenancejob_group_group_key" ON "maintenancejob_group"("group");

-- CreateIndex
CREATE UNIQUE INDEX "maintenancejob_name_key" ON "maintenancejob"("name");

-- AddForeignKey
ALTER TABLE "vehicle" ADD CONSTRAINT "vehicle_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "material" ADD CONSTRAINT "material_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "material_group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "maintenancejob" ADD CONSTRAINT "maintenancejob_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "maintenancejob_group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "item_material" ADD CONSTRAINT "item_material_serviceorder_id_fkey" FOREIGN KEY ("serviceorder_id") REFERENCES "serviceorder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "item_material" ADD CONSTRAINT "item_material_material_id_fkey" FOREIGN KEY ("material_id") REFERENCES "material"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "item_maintenance" ADD CONSTRAINT "item_maintenance_serviceorder_id_fkey" FOREIGN KEY ("serviceorder_id") REFERENCES "serviceorder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "item_maintenance" ADD CONSTRAINT "item_maintenance_maintenance_id_fkey" FOREIGN KEY ("maintenance_id") REFERENCES "maintenancejob"("id") ON DELETE SET NULL ON UPDATE CASCADE;
