import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CustomersModule } from './customer/customer.module';
import { PrismaModule } from './prisma/prisma.module';
import { VehicleModule } from './vehicle/vehicle.module';
import { MaterialGroupModule } from './material-group/material-group.module';
import { MaintenanceGroupModule } from './maintenance-group/maintenance-group.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    CustomersModule,
    PrismaModule,
    VehicleModule,
    MaterialGroupModule,
    MaintenanceGroupModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
