import { Module } from '@nestjs/common';
import { MovieController } from './movie.controller';
import { MovieService } from './movie.service';
import { MongooseModule } from '@nestjs/mongoose';
import { HttpModule } from '@nestjs/axios';
import { movieSchema } from './movie.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Movie', schema: movieSchema }]),
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
  ],

  controllers: [MovieController],
  providers: [MovieService],
})
export class MovieModule {}
