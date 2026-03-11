import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CustomerModule } from './customer/customer.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { CarModule } from './car/car.module';
import { OrderModule } from './order/order.module';
import { MaterialModule } from './material/material.module';
import { GroupModule } from './group/group.module';
import { MaintenanceModule } from './maintenance/maintenance.module';
import { ItemMaterialModule } from './item-material/item-material.module';
import { ItemMaintenanceModule } from './item-maintenance/item-maintenance.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule,
    CustomerModule,
    CarModule,
    OrderModule,
    MaterialModule,
    GroupModule,
    MaintenanceModule,
    ItemMaterialModule,
    ItemMaintenanceModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
