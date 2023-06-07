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
  Query,
  UseGuards,
  ValidationPipe,
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
import { PageDto } from 'src/prisma/helper/prisma.helper';
import {
  BanUserDto,
  ChangeImageOrderDto,
  CreateImageDto,
  GetRecommendedUsersDto,
  LikeUserDto,
  SkipUserDto,
  StarUserDto,
  UpdateImageDto,
  UpdateIntoShownFieldsDto,
  UpdateUserDto,
} from './dto/user.dto';
import { ImageModel, UserDetailInfo, UserModel } from './model/user.model';
import { UserService } from './user.service';

type UserType = Pick<user, 'role' | 'id' | 'username' | 'email'>;

@ApiTags('USER')
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: APISummaries.ADMIN })
  @ApiOkResponse({ type: UserDetailInfo })
  @ApiBearerAuth()
  @UseGuards(AdminGuard)
  @Get()
  getAllUsers(
    @Query(new ValidationPipe({ transform: true })) query: PageDto,
  ): Promise<UserDetailInfo[]> {
    return this.userService.getAllUsers(query);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: APISummaries.USER })
  @ApiOkResponse({ type: ImageModel })
  @ApiBearerAuth()
  @UseGuards(UserGuard)
  @Get('images')
  getAllImages(
    @Query(new ValidationPipe({ transform: true })) query: PageDto,
    @GetUser() user: UserType,
  ): Promise<ImageModel[]> {
    return this.userService.getAllImages(query, {
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
  @ApiOkResponse({ type: String })
  @ApiBearerAuth()
  @UseGuards(UserGuard)
  @Put('shown-fields')
  updateIntroShownFields(
    @Body() dto: UpdateIntoShownFieldsDto,
    @GetUser() user: UserType,
  ): Promise<string> {
    this.userService.updateIntroShownFields(dto, {
      role: user.role,
      username: user.username,
    });

    return Promise.resolve('Updated');
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
  @ApiOperation({ summary: APISummaries.ADMIN })
  @ApiOkResponse({ type: String })
  @ApiBearerAuth()
  @UseGuards(AdminGuard)
  @Post('ban')
  banUser(@Body() dto: BanUserDto): Promise<string> {
    return this.userService.banUser(dto.username);
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
  @ApiOkResponse({ type: UserDetailInfo })
  @ApiBearerAuth()
  @UseGuards(UserGuard)
  @Get('liked')
  getLikedUsers(
    @Query(new ValidationPipe({ transform: true })) query: PageDto,
    @GetUser() user: UserType,
  ): Promise<UserDetailInfo[]> {
    return this.userService.getLikedUsers(query, {
      username: user.username,
    });
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: APISummaries.USER })
  @ApiOkResponse({ type: Number })
  @ApiBearerAuth()
  @UseGuards(UserGuard)
  @Get('liked-count')
  getLikedUsersCount(@GetUser() user: UserType): Promise<number> {
    return this.userService.getLikedUsersCount({
      username: user.username,
    });
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: APISummaries.USER })
  @ApiOkResponse({ type: UserDetailInfo })
  @ApiBearerAuth()
  @UseGuards(UserGuard)
  @Get('starred')
  getStarredUsers(
    @Query(new ValidationPipe({ transform: true })) query: PageDto,
    @GetUser() user: UserType,
  ): Promise<UserDetailInfo[]> {
    return this.userService.getStarredUsers(query, {
      username: user.username,
    });
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: APISummaries.USER })
  @ApiOkResponse({ type: Number })
  @ApiBearerAuth()
  @UseGuards(UserGuard)
  @Get('starred-count')
  getStarredUsersCount(@GetUser() user: UserType): Promise<number> {
    return this.userService.getStarredUsersCount({
      username: user.username,
    });
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: APISummaries.USER })
  @ApiOkResponse({ type: UserDetailInfo })
  @ApiBearerAuth()
  @UseGuards(UserGuard)
  @Get('skipped')
  getSkippedUsers(
    @Query(new ValidationPipe({ transform: true })) query: PageDto,
    @GetUser() user: UserType,
  ): Promise<UserDetailInfo[]> {
    return this.userService.getSkippedUsers(query, {
      username: user.username,
    });
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: APISummaries.USER })
  @ApiOkResponse({ type: Number })
  @ApiBearerAuth()
  @UseGuards(UserGuard)
  @Get('skipped-count')
  getSkippedUsersCount(@GetUser() user: UserType): Promise<number> {
    return this.userService.getSkippedUsersCount({
      username: user.username,
    });
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: APISummaries.USER })
  @ApiOkResponse({ type: UserDetailInfo })
  @ApiBearerAuth()
  @UseGuards(UserGuard)
  @Get('matched')
  getMatchedUsers(
    @Query(new ValidationPipe({ transform: true })) query: PageDto,
    @GetUser() user: UserType,
  ): Promise<UserDetailInfo[]> {
    return this.userService.getMatchedUsers(query, {
      username: user.username,
    });
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: APISummaries.USER })
  @ApiOkResponse({ type: Number })
  @ApiBearerAuth()
  @UseGuards(UserGuard)
  @Get('matched-count')
  getMatchedUsersCount(@GetUser() user: UserType): Promise<number> {
    return this.userService.getMatchedUsersCount({
      username: user.username,
    });
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: APISummaries.USER })
  @ApiOkResponse({ type: UserDetailInfo })
  @ApiBearerAuth()
  @UseGuards(UserGuard)
  @Get('recommended')
  getRecommendedUsers(
    @Query(new ValidationPipe({ transform: true }))
    query: GetRecommendedUsersDto,
    @GetUser() user: UserType,
  ): Promise<UserDetailInfo[]> {
    return this.userService.getRecommendedUsers(query, {
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
  @Put('images/:id')
  updateImageById(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: UserType,
    @Body() dto: UpdateImageDto,
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
  @Put('images/order/:id')
  changeImageOrder(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: UserType,
    @Body() dto: ChangeImageOrderDto,
  ): Promise<ImageModel> {
    return this.userService.changeImageOrder(id, dto, {
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

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: APISummaries.USER })
  @ApiOkResponse({ type: UserDetailInfo })
  @ApiBearerAuth()
  @UseGuards(UserGuard)
  @Get('info-with-images/:username')
  getUserInfoWithImagesByUsername(
    @Param('username') username: string,
    @GetUser() user: UserType,
  ): Promise<UserDetailInfo> {
    return this.userService.getUserInfoWithImagesByUsername(username, {
      role: user.role,
      username: user.username,
    });
  }
}
