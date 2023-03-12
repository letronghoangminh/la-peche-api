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
import {
  CreateImageDto,
  LikeUserDto,
  SkipUserDto,
  StarUserDto,
  UpdateImageDto,
  UpdateUserDto,
} from './dto/user.dto';
import { ImageModel, UserModel } from './model/user.model';
import { UserService } from './user.service';

type UserType = Pick<user, 'role' | 'id' | 'username' | 'email'>;

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
  @ApiOkResponse({ type: UserModel })
  @ApiBearerAuth()
  @UseGuards(UserGuard)
  @Get('info/:username')
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
  @Post('like')
  likeUser(
    @Body() dto: LikeUserDto,
    @GetUser() user: UserType,
  ): Promise<string> {
    return this.userService.likeUser(dto.username, {
      role: user.role,
      username: user.username,
    });
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: APISummaries.USER })
  @ApiOkResponse({ type: String })
  @ApiBearerAuth()
  @UseGuards(UserGuard)
  @Post('unlike')
  unlikeUser(
    @Body() dto: LikeUserDto,
    @GetUser() user: UserType,
  ): Promise<string> {
    return this.userService.unlikeUser(dto.username, {
      role: user.role,
      username: user.username,
    });
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: APISummaries.USER })
  @ApiOkResponse({ type: String })
  @ApiBearerAuth()
  @UseGuards(UserGuard)
  @Post('star')
  starUser(
    @Body() dto: StarUserDto,
    @GetUser() user: UserType,
  ): Promise<string> {
    return this.userService.starUser(dto.username, {
      role: user.role,
      username: user.username,
    });
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: APISummaries.USER })
  @ApiOkResponse({ type: String })
  @ApiBearerAuth()
  @UseGuards(UserGuard)
  @Post('unstar')
  unstarUser(
    @Body() dto: LikeUserDto,
    @GetUser() user: UserType,
  ): Promise<string> {
    return this.userService.unstarUser(dto.username, {
      role: user.role,
      username: user.username,
    });
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: APISummaries.USER })
  @ApiOkResponse({ type: String })
  @ApiBearerAuth()
  @UseGuards(UserGuard)
  @Post('skip')
  skipUser(
    @Body() dto: SkipUserDto,
    @GetUser() user: UserType,
  ): Promise<string> {
    return this.userService.skipUser(dto.username, {
      role: user.role,
      username: user.username,
    });
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: APISummaries.USER })
  @ApiOkResponse({ type: String })
  @ApiBearerAuth()
  @UseGuards(UserGuard)
  @Post('unskip')
  unskipUser(
    @Body() dto: SkipUserDto,
    @GetUser() user: UserType,
  ): Promise<string> {
    return this.userService.unskipUser(dto.username, {
      role: user.role,
      username: user.username,
    });
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: APISummaries.USER })
  @ApiOkResponse({ type: String })
  @ApiBearerAuth()
  @UseGuards(UserGuard)
  @Post('verify')
  verifyUser(@GetUser() user: UserType): Promise<string> {
    return this.userService.verifyUser({
      email: user.email,
      username: user.username,
    });
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: APISummaries.USER })
  @ApiOkResponse({ type: UserModel })
  @ApiBearerAuth()
  @UseGuards(UserGuard)
  @Get('liked')
  getLikedUsers(@GetUser() user: UserType): Promise<UserModel[]> {
    return this.userService.getLikedUsers({
      username: user.username,
    });
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: APISummaries.USER })
  @ApiOkResponse({ type: UserModel })
  @ApiBearerAuth()
  @UseGuards(UserGuard)
  @Get('starred')
  getStarredUsers(@GetUser() user: UserType): Promise<UserModel[]> {
    return this.userService.getStarredUsers({
      username: user.username,
    });
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: APISummaries.USER })
  @ApiOkResponse({ type: UserModel })
  @ApiBearerAuth()
  @UseGuards(UserGuard)
  @Get('skipped')
  getSkippedUsers(@GetUser() user: UserType): Promise<UserModel[]> {
    return this.userService.getSkippedUsers({
      username: user.username,
    });
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: APISummaries.USER })
  @ApiOkResponse({ type: UserModel })
  @ApiBearerAuth()
  @UseGuards(UserGuard)
  @Get('matched')
  getMatchedUsers(@GetUser() user: UserType): Promise<UserModel[]> {
    return this.userService.getMatchedUsers({
      username: user.username,
    });
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: APISummaries.USER })
  @ApiOkResponse({ type: UserModel })
  @ApiBearerAuth()
  @UseGuards(UserGuard)
  @Get('recommended')
  getRecommendedUsers(@GetUser() user: UserType): Promise<UserModel[]> {
    return this.userService.getRecommendedUsers({
      username: user.username,
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
