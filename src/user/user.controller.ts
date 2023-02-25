import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { user } from '@prisma/client';
import { GetUser } from 'src/auth/decorator/get-user.decorator';
import { AdminGuard, UserGuard } from 'src/auth/guard/auth.guard';
import { APISummaries } from 'src/helpers/helpers';
import { CreateImageDto, UpdateImageDto, UpdateUserDto } from './dto/user.dto';
import { ImageModel, UserModel } from './model/user.model';
import { UserService } from './user.service';

type UserType = Pick<user, 'role' | 'id' | 'username'>;

@ApiTags('USER')
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: APISummaries.ADMIN })
  @ApiOkResponse({ type: UserModel })
  @ApiBearerAuth()
  @UseGuards(AdminGuard)
  @Get()
  getAllUsers(): Promise<UserModel[]> {
    return this.userService.getAllUsers();
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: APISummaries.USER })
  @ApiOkResponse({ type: UserModel })
  @ApiBearerAuth()
  @UseGuards(UserGuard)
  @Get(':username')
  getUserByUsername(
    @Param('username') username: string,
    @GetUser() user: UserType,
  ): Promise<UserModel> {
    return this.userService.getUserByUsername(username, {
      role: user.role,
      username: user.username,
    });
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: APISummaries.USER })
  @ApiOkResponse({ type: UserModel })
  @ApiBearerAuth()
  @UseGuards(UserGuard)
  @Put(':username')
  updateUser(
    @Param('username') username: string,
    @Body() dto: UpdateUserDto,
    @GetUser() user: UserType,
  ): Promise<UserModel> {
    return this.userService.updateUser(username, dto, {
      role: user.role,
      username: user.username,
    });
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: APISummaries.USER })
  @ApiOkResponse({ type: UserModel })
  @ApiBearerAuth()
  @UseGuards(UserGuard)
  @Delete(':username')
  deleteUser(
    @Param('username') username: string,
    @GetUser() user: UserType,
  ): Promise<string> {
    return this.userService.deleteUser(username, {
      role: user.role,
      username: user.username,
    });
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: APISummaries.USER })
  @ApiOkResponse({ type: String })
  @ApiBearerAuth()
  @UseGuards(UserGuard)
  @Post(':username/like')
  likeUser(
    @Param('username') username: string,
    @GetUser() user: UserType,
  ): Promise<string> {
    return this.userService.likeUser(username, {
      role: user.role,
      username: user.username,
    });
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: APISummaries.USER })
  @ApiOkResponse({ type: String })
  @ApiBearerAuth()
  @UseGuards(UserGuard)
  @Post(':username/star')
  starUser(
    @Param('username') username: string,
    @GetUser() user: UserType,
  ): Promise<string> {
    return this.userService.starUser(username, {
      role: user.role,
      username: user.username,
    });
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: APISummaries.USER })
  @ApiOkResponse({ type: ImageModel })
  @ApiBearerAuth()
  @UseGuards(UserGuard)
  @Get('images')
  getAllImages(@GetUser() user: UserType): Promise<ImageModel[]> {
    return this.userService.getAllImages({
      role: user.role,
      username: user.username,
      userId: user.id,
    });
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: APISummaries.USER })
  @ApiOkResponse({ type: ImageModel })
  @ApiBearerAuth()
  @UseGuards(UserGuard)
  @Post('images')
  createImage(
    @Body() dto: CreateImageDto,
    @GetUser() user: UserType,
  ): Promise<ImageModel> {
    return this.userService.createImage(dto, {
      role: user.role,
      username: user.username,
      userId: user.id,
    });
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: APISummaries.USER })
  @ApiOkResponse({ type: ImageModel })
  @ApiBearerAuth()
  @UseGuards(UserGuard)
  @Delete('images/:id')
  updateImageById(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateImageDto,
    @GetUser() user: UserType,
  ): Promise<ImageModel> {
    return this.userService.updateImageById(id, dto, {
      role: user.role,
      username: user.username,
      userId: user.id,
    });
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: APISummaries.USER })
  @ApiOkResponse({ type: ImageModel })
  @ApiBearerAuth()
  @UseGuards(UserGuard)
  @Delete('images/:id')
  deleteImageById(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: UserType,
  ): Promise<ImageModel> {
    return this.userService.deleteImageById(id, {
      role: user.role,
      username: user.username,
      userId: user.id,
    });
  }
}
