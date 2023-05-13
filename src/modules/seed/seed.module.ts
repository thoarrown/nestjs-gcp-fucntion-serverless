import { MongooseModule } from '@nestjs/mongoose';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { movieSchema } from '../movie/movie.schema';
import { SeedService } from './seed.service';
import { Logger, LoggerModule, PinoLogger } from 'nestjs-pino';
import { ConfigModule, ConfigService } from 'src/config';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get('MONGODB_URL'),
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }),
      inject: [ConfigService],
    }),
    ConfigModule,
    MongooseModule.forFeature([{ name: 'Movie', schema: movieSchema }]),
    LoggerModule.forRoot(),
  ],
  providers: [Logger, SeedService],
})
export class SeederModule {}
