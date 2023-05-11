import { Controller, Get } from '@nestjs/common';

@Controller('movie')
export class MovieController {
  @Get()
  getHello(): string {
    return 'Hello Movie!';
  }
}
