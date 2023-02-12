import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';
import { UserGuard, AdminGuard } from './auth/guard/auth.guard';

@Controller()
@ApiTags('DEFAULT')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('user')
  @UseGuards(UserGuard)
  @ApiBearerAuth()
  getUser(): string {
    return this.appService.getHello();
  }

  @Get('admin')
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  getAdmin(): string {
    return this.appService.getHello();
  }
}
