import { Controller, Get, Headers, Ip, Req } from '@nestjs/common';
import { Request } from 'express';

import { MovieService } from './movie.service';

@Controller('movie')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}
  @Get()
  async getHello(@Req() request: Request) {
    const ip =
      request.headers['x-forwarded-for'] || request.connection.remoteAddress;
    const ipAddress = request.socket.remoteAddress;
    console.log('ipAddress', ip, ipAddress);
    return this.movieService.getList(ip as string);
  }
}
