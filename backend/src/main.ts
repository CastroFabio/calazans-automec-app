import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as cors from 'cors';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [
      'http://localhost:5173', // Vite (React)
      'http://localhost:3000', // Próprio backend
      'http://localhost:5174', // Outras portas do Vite
      'http://localhost:3001', // Outras portas
      /\.vercel\.app$/, // Para deploy na Vercel
      'https://calazans-automec-frontend.onrender.com',
    ],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Accept',
      'Origin',
      'X-Requested-With',
    ],
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Calazans Automec API')
    .setDescription('API para gerenciamento de oficina mecânica')
    .setVersion('1.0')
    .addTag('customers', 'Gerenciamento de clientes')
    .addTag('vehicles', 'Gerenciamento de veículos')
    .addTag('service-order', 'Gerenciamento de ordens de serviço')
    .addTag('material', 'Gerenciamento de itens de material')
    .addTag('maintenance', 'Gerenciamento de serviços de manutenção')
    .addTag(
      'maintenance-group',
      'Gerenciamento de grupos de serviços de manutenção',
    )
    .addTag('material-group', 'Gerenciamento de grupos de itens de material')
    .addTag(
      'maintenance-item',
      'Gerenciamento de grupos de serviços de manutenção dentro da ordem de serviço',
    )
    .addTag(
      'material-item',
      'Gerenciamento de grupos de itens de material dentro da ordem de serviço',
    )
    .addBearerAuth() // Se usar autenticação JWT
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: 'none',
      displayRequestDuration: true,
    },
  });
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
