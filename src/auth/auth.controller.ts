import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { APISummaries } from 'src/helpers/helpers';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import { AuthModel } from './model/auth.model';

@Controller('auth')
@ApiTags('AUTH')
export class AuthController {
  constructor(private authSerivce: AuthService) {}

  @ApiOperation({ summary: APISummaries.UNAUTH })
  @HttpCode(HttpStatus.CREATED)
  @ApiOkResponse({ type: AuthModel })
  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authSerivce.register(dto);
  }

  @ApiOperation({ summary: APISummaries.UNAUTH })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: AuthModel })
  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authSerivce.login(dto);
  }
}
