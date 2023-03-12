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
import { NotificationStatus } from 'src/enum/notification-status.enum';
import { APISummaries } from 'src/helpers/helpers';
import { PageDto } from 'src/prisma/helper/prisma.helper';
import {
  CreateNotifcationDto,
  UpdateNofiticationDto,
} from './dto/notification.dto';
import { BaseModel, NotificationModel } from './model/notification.model';
import { NotificationService } from './notification.service';

type UserType = Pick<user, 'role' | 'id'>;

@Controller('notifications')
@ApiTags('NOTIFICATIONS')
export class NotificationController {
  constructor(private notificationService: NotificationService) {}

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: APISummaries.USER })
  @ApiOkResponse({ type: NotificationModel })
  @ApiBearerAuth()
  @UseGuards(UserGuard)
  @Get()
  getAllNotifications(
    @Query(new ValidationPipe({ transform: true })) query: PageDto,
    @GetUser() user: UserType,
  ): Promise<NotificationModel[]> {
    return this.notificationService.getAllNotifications(query, {
      role: user.role,
      id: user.id,
    });
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: APISummaries.USER })
  @ApiOkResponse({ type: NotificationModel })
  @ApiBearerAuth()
  @UseGuards(UserGuard)
  @Get(':id')
  getNotificationById(
    @GetUser() user: UserType,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<NotificationModel> {
    return this.notificationService.getNotificationById(id, {
      role: user.role,
      id: user.id,
    });
  }

  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: APISummaries.ADMIN })
  @ApiOkResponse({ type: NotificationModel })
  @ApiBearerAuth()
  @UseGuards(AdminGuard)
  @Post()
  createNotification(
    @Body() dto: CreateNotifcationDto,
  ): Promise<NotificationModel> {
    return this.notificationService.createNotification(dto);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: APISummaries.USER })
  @ApiOkResponse({ type: NotificationModel })
  @ApiBearerAuth()
  @UseGuards(UserGuard)
  @Delete(':id')
  deleteNotificationById(
    @GetUser() user: UserType,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ count: number }> {
    return this.notificationService.deleteNotificationById(id, {
      role: user.role,
      id: user.id,
    });
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: APISummaries.ADMIN })
  @ApiOkResponse({ type: NotificationModel })
  @ApiBearerAuth()
  @UseGuards(AdminGuard)
  @Put(':id')
  updateNotificationById(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateNofiticationDto,
  ): Promise<NotificationModel> {
    return this.notificationService.updateNotificationById(id, dto);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: APISummaries.USER })
  @ApiOkResponse({ type: NotificationModel })
  @ApiBearerAuth()
  @UseGuards(UserGuard)
  @Put(':id/read')
  readNotificationById(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: UserType,
  ): Promise<BaseModel> {
    return this.notificationService.changeStatusNotificationById(
      id,
      {
        role: user.role,
        id: user.id,
      },
      NotificationStatus.READ,
    );
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: APISummaries.USER })
  @ApiOkResponse({ type: NotificationModel })
  @ApiBearerAuth()
  @UseGuards(UserGuard)
  @Put(':id/pin')
  pinNotificationById(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: UserType,
  ): Promise<BaseModel> {
    return this.notificationService.changeStatusNotificationById(
      id,
      {
        role: user.role,
        id: user.id,
      },
      NotificationStatus.PINNED,
    );
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: APISummaries.USER })
  @ApiOkResponse({ type: NotificationModel })
  @ApiBearerAuth()
  @UseGuards(UserGuard)
  @Put(':id/unread')
  unreadNotificationById(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: UserType,
  ): Promise<BaseModel> {
    return this.notificationService.changeStatusNotificationById(
      id,
      {
        role: user.role,
        id: user.id,
      },
      NotificationStatus.UNREAD,
    );
  }
}
