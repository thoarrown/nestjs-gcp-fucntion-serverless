import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { camelCase, mapKeys } from 'lodash';
@Injectable()
export class MovieService {
  constructor(
    private readonly httpService: HttpService,
    @InjectModel('Movie') private readonly movieModel: Model<any>,
  ) {}
  async getList(ip: string) {
    let countryCode = null;
    let movie = null;

    try {
      const geoResponse = await this.httpService.axiosRef.get(
        `http://ip-api.com/json/${ip}`,
      );
      console.log('geoResponse', JSON.stringify(geoResponse.data));
      countryCode = geoResponse.data.countryCode;
      if (geoResponse.data.status === 'fail') {
        console.error('Error determining country or fetching movie: ');
      }

      movie = await this.movieModel
        .aggregate([
          { $match: { country: countryCode } },
          { $sample: { size: 1 } },
        ])
        .exec();
    } catch (error) {
      console.error('Error determining country or fetching movie: ', error);
    }

    if (!movie || movie.length === 0) {
      movie = await this.movieModel
        .aggregate([{ $sample: { size: 1 } }])
        .exec();
    }
    if (!movie || movie.length === 0) {
      throw new BadRequestException(`No movies found. Ip: ${ip}`);
    } else {
      const movieData = movie[0];

      // const response = {
      //   countryCode: movieData.country,
      //   dateCreated: movieData.dateCreated,
      //   dateModified: movieData.dateModified,
      //   category: movieData.category,
      //   id: movieData.youtubeId,
      //   adNetwork: movieData.,
      //   params: 'start=24',
      //   playlist: false,
      //   playlistCoverId: movieData.playlistCoverId,
      //   poster: 'hqdefault',
      //   title: movieData.title,
      //   noCookie: movieData.,
      // };
      return mapKeys(movieData, (v, k) => camelCase(k));
    }
  }
}
