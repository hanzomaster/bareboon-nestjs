import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.use(cookieParser());
  app.use(compression());
  app.use(helmet());
  app.use(compression());

  const globalPrefix = process.env.APP_ROUTE_PREFIX ?? '';
  app.setGlobalPrefix(globalPrefix);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      disableErrorMessages: process.env.NODE_ENV !== 'development',
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('My API')
    .setDescription('Des')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(`${globalPrefix}/docs`, app, document, {
    customSiteTitle: 'My API',
  });

  const PORT = process.env.APP_PORT ?? 8080;
  await app.listen(PORT, () => {
    Logger.log(
      `Documentation is running on: ${process.env.APP_SCHEMA}://${process.env.APP_HOST}:${PORT}/${globalPrefix}/docs`,
      'Documentation',
    );
    Logger.log(
      `Server is running on: ${process.env.APP_SCHEMA}://${process.env.APP_HOST}:${PORT}/${globalPrefix}`,
      'NestAPI',
    );
  });
}
bootstrap();
