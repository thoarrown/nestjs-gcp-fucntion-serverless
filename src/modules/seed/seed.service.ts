import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Logger } from 'nestjs-pino';
import { parse } from 'csv-parse';
import * as fs from 'fs';
import * as path from 'path';
import { MovieFields } from './movie/fields';
import { Movie } from '../movie/movie.interface';

@Injectable()
export class SeedService {
  constructor(
    private readonly logger: Logger,
    @InjectModel('Movie') public readonly movieModel: Model<any>,
  ) {}

  async seed() {
    console.log('Successfuly completed seeding users...');

    const data = await this.movies()
      .then((completed) => {
        this.logger.debug('Successfuly completed seeding users...');
        console.log('completed');
      })
      .catch((error) => {
        this.logger.error('Failed seeding users...');
        Promise.reject(error);
      });
  }

  async movies() {
    const csvData = [];
    let headerFile;

    const movies: Movie[] = await new Promise((resolve) => {
      fs.createReadStream(
        path.join(__dirname, './movie/youtubelist.csv'),
        'utf8',
      )
        .pipe(parse())
        .on('data', function (row) {
          if (!headerFile) {
            headerFile = row;
          } else if (headerFile.length === row.length) {
            try {
              const data: any = {};
              for (let i = 0; i < headerFile.length; i += 1) {
                if (MovieFields[headerFile[i]]) {
                  let value = row[i];

                  if (
                    ['true', 'false'].includes((row[i] as string).toLowerCase())
                  ) {
                    value = (row[i] as string).toLowerCase() === 'true';
                  }

                  data[MovieFields[headerFile[i]]] = value;
                }
              }
              csvData.push(data);
            } catch (error) {
              console.log(error);
            }
          }
        })
        .on('end', function () {
          //do something with csvData
          return resolve(csvData);
        });
    });
    //
    const movieFound = await this.movieModel
      .find()
      .where('youtube_id')
      .in(movies.map((el) => el.youtube_id));

    const movieInsert = await this.movieModel.create(
      movies.filter(
        (el) => !movieFound.some((f) => f.youtube_id === el.youtube_id),
      ),
    );

    return movieInsert;
  }
}
