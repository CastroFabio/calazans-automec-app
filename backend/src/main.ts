import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Calazans Automec API')
    .setDescription('API para gerenciamento de oficina mecânica')
    .setVersion('1.0')
    .addTag('customers', 'Gerenciamento de clientes')
    .addTag('vehicles', 'Gerenciamento de veículos')
    .addTag('service-orders', 'Gerenciamento de ordens de serviço')
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
