import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Logger } from 'nestjs-pino';
import { parse } from 'csv-parse';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class SeedService {
  constructor(
    private readonly logger: Logger,
    @InjectModel('Movie') private readonly movieModel: Model<any>,
  ) {}
  async seed() {
    console.log('Successfuly completed seeding users...');

    await this.movies()
      .then((completed) => {
        this.logger.debug('Successfuly completed seeding users...');
        Promise.resolve(completed);
      })
      .catch((error) => {
        this.logger.error('Failed seeding users...');
        Promise.reject(error);
      });
  }
  async movies() {
    const csvData = [];

    // const myFile =;
    // console.log('myFile', myFile);
    // return;
    return fs
      .createReadStream(path.join(__dirname, './movie/youtubelist.csv'), 'utf8')
      .pipe(parse({ delimiter: ':' }))
      .on('data', function (csvrow) {
        console.log(csvrow);
        //do something with csvrow
        csvData.push(csvrow);
      })
      .on('end', function () {
        //do something with csvData
        console.log(csvData);
      });
  }
}
