import { Controller, Get } from '@nestjs/common';

@Controller('auth')
export class AuthController {

  @Get()
  async hello() {
    return "This is auth module";
  }
}
