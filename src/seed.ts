import { NestFactory } from '@nestjs/core';
import { SeederModule } from './modules/seed/seed.module';
import { SeedService } from './modules/seed/seed.service';
import { Logger } from 'nestjs-pino';

async function bootstrap() {
  NestFactory.createApplicationContext(SeederModule, { bufferLogs: true })
    .then((appContext) => {
      appContext.useLogger(appContext.get(Logger));

      const logger = appContext.get(Logger);
      const seeder = appContext.get(SeedService);
      seeder
        .seed()
        .then(() => {
          logger.debug('Seeding complete!');
        })
        .catch((error) => {
          logger.error('Seeding failed!');
          throw error;
        })
        .finally(() => appContext.close());
    })
    .catch((error) => {
      throw error;
    });
}
bootstrap();
