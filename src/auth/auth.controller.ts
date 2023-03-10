import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { user } from '@prisma/client';
import { APISummaries } from 'src/helpers/helpers';
import { AuthService } from './auth.service';
import { GetUser } from './decorator/get-user.decorator';
import { LoginDto, RegisterDto, VerifyUserDto } from './dto/auth.dto';
import { UserGuard } from './guard/auth.guard';
import { AuthModel } from './model/auth.model';

type UserType = Pick<user, 'role' | 'id' | 'username' | 'email'>;

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

  @ApiOperation({ summary: APISummaries.USER })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: String })
  @ApiBearerAuth()
  @UseGuards(UserGuard)
  @Get('verify')
  verify(@Query() query: VerifyUserDto, @GetUser() user: UserType) {
    return this.authSerivce.verify(query, {
      email: user.email,
      username: user.username,
    });
  }
}
