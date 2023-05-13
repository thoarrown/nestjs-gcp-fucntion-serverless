import {
  BadRequestException,
  HttpException,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger } from 'nestjs-pino';
import { AppModule } from './app.module';
import * as config from 'config';
import * as express from 'express';
import { ExpressAdapter } from '@nestjs/platform-express';

let server: any;

async function bootstrap(expressInstance: any) {
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressInstance),
    { bufferLogs: true },
  );

  await setupSwaggerDoc(app);

  app.useLogger(app.get(Logger));
  // app.useGlobalFilters(new HttpExceptionFilter());
  // await app.init();

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      exceptionFactory: (error) => {
        const objError = error[0].constraints;
        throw new BadRequestException(objError[Object.keys(objError)[0]]);
      },
    }),
  );

  if (!config.get('service.serverless')) {
    await app.listen(config.get('service.port'));
  }
}

async function setupSwaggerDoc(app: INestApplication): Promise<void> {
  const swaggerConfig = new DocumentBuilder()
    .setTitle('APP')
    .setDescription('The app api service')
    .setVersion(config.get('service.version'))
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document);
}

function init() {
  if (!server) {
    server = express();
    bootstrap(server);
  }
}

init();

export const http = server;
