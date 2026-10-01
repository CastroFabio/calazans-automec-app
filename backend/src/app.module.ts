import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CustomersModule } from './customer/customer.module';
import { PrismaModule } from './prisma/prisma.module';
import { VehicleModule } from './vehicle/vehicle.module';
import { MaterialGroupModule } from './material-group/material-group.module';
import { MaintenanceGroupModule } from './maintenance-group/maintenance-group.module';
import { MaterialModule } from './material/material.module';
import { MaintenanceModule } from './maintenance/maintenance.module';
import { MaterialItemModule } from './material-item/material-item.module';
import { ServiceOrderModule } from './service-order/service-order.module';
import { MaintenanceItemModule } from './maintenance-item/maintenance-item.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import {
  WinstonModule,
  utilities as nestWinstonModuleUtilities,
} from 'nest-winston';
import * as winston from 'winston';
import 'winston-daily-rotate-file';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    WinstonModule.forRoot({
      transports: [
        // 1. Logs coloridos no Console (Ideal para desenvolvimento)
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
            winston.format.ms(),
            nestWinstonModuleUtilities.format.nestLike('CalazansAutomec', {
              colors: true,
              prettyPrint: true,
            }),
          ),
        }),

        // 2. Arquivo de Log Diário para Erros
        new winston.transports.DailyRotateFile({
          filename: 'logs/error-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          level: 'error',
          maxFiles: '30d', // Mantém os logs dos últimos 30 dias
          maxSize: '20m',
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json(),
          ),
        }),

        // 3. Arquivo de Log Diário Geral (Todos os níveis)
        new winston.transports.DailyRotateFile({
          filename: 'logs/combined-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          maxFiles: '14d',
          maxSize: '20m',
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json(),
          ),
        }),
      ],
    }),
    CustomersModule,
    PrismaModule,
    VehicleModule,
    MaterialGroupModule,
    MaintenanceGroupModule,
    MaterialModule,
    MaintenanceModule,
    MaterialItemModule,
    ServiceOrderModule,
    MaintenanceItemModule,
    UserModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule {}
