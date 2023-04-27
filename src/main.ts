import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
require('newrelic');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('_api');
  const configService = app.get(ConfigService);

  const swaggerConfig = new DocumentBuilder()
    .setTitle('La Pêche API')
    .setDescription('La Pêche API Documentation')
    .setVersion('1.0')
    .setContact('LaPeche', 'https://lapeche.date', 'lapeche.date@gmail.com')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);

  SwaggerModule.setup(
    `_api/${configService.get('swagger.docsUrl')}`,
    app,
    document,
  );

  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();
  await app.listen(configService.get('app.port'), '0.0.0.0');
}
bootstrap();
