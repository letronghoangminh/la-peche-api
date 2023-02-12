import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AppService } from './app.service';
import { JwtGuard } from './auth/guard/auth.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  getHello(): string {
    return this.appService.getHello();
  }
}
