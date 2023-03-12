import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { NotificationStatus } from 'src/enum/notification-status.enum';
import { Role } from 'src/enum/role.enum';
import { ErrorMessages, Messages } from 'src/helpers/helpers';
import { PageDto, PaginationHandle } from 'src/prisma/helper/prisma.helper';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  CreateNotifcationDto,
  UpdateNofiticationDto,
} from './dto/notification.dto';
import { BaseModel, NotificationModel } from './model/notification.model';

@Injectable()
export class NotificationService {
  constructor(private prismaService: PrismaService) {}

  async getAllNotifications(
    query: PageDto,
    user: {
      role: string;
      id: number;
    },
  ): Promise<NotificationModel[]> {
    const dbQuery = {};

    if (!(user.role === Role.ADMIN))
      dbQuery['where'] = {
        userId: user.id,
      };

    PaginationHandle(dbQuery, query.page, query.pageSize);
    return await this.prismaService.notification.findMany(dbQuery);
  }

  async getNotificationById(
    id: number,
    user: { role: string; id: number },
  ): Promise<NotificationModel> {
    const condition = { id: id };

    if (!(user.role === Role.ADMIN)) condition['userId'] = user.id;

    const notification = await this.prismaService.notification.findFirst({
      where: condition,
    });

    if (!notification)
      throw new NotFoundException(ErrorMessages.NOTIFICATION.NOTI_NOT_FOUND);

    return notification;
  }

  async createNotification(
    dto: CreateNotifcationDto,
  ): Promise<NotificationModel> {
    return await this.prismaService.notification.create({
      data: {
        userId: dto.userId,
        text: dto.text,
        status: NotificationStatus.UNREAD,
      },
    });
  }

  async deleteNotificationById(
    id: number,
    user: { role: string; id: number },
  ): Promise<{ count: number }> {
    const condition = { id: id };

    if (!(user.role === Role.ADMIN)) condition['userId'] = user.id;

    const notification = await this.prismaService.notification.deleteMany({
      where: condition,
    });

    if (!notification)
      throw new NotFoundException(ErrorMessages.NOTIFICATION.NOTI_NOT_FOUND);

    if (notification.count == 0)
      throw new NotFoundException(ErrorMessages.NOTIFICATION.NOTI_NOT_FOUND);

    return { count: notification.count };
  }

  async updateNotificationById(
    id: number,
    dto: UpdateNofiticationDto,
  ): Promise<NotificationModel> {
    try {
      return await this.prismaService.notification.update({
        where: {
          id: id,
        },
        data: {
          text: dto.text,
          status: dto.status,
        },
      });
    } catch (error) {
      console.log(error.code);
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(
            ErrorMessages.NOTIFICATION.NOTI_NOT_FOUND,
          );
        }
      }
      throw error;
    }
  }

  async changeStatusNotificationById(
    id: number,
    user: { role: string; id: number },
    status: NotificationStatus,
  ): Promise<BaseModel> {
    try {
      const notification = await this.prismaService.notification.findFirst({
        where: {
          id: id,
          userId: user.id,
        },
      });

      if (notification) {
        await this.prismaService.notification.update({
          where: {
            id: id,
          },
          data: {
            status: status,
          },
        });
        return {
          status: true,
          message: Messages.NOTIFICATION['NOTI_' + status],
        };
      } else {
        throw new NotFoundException(ErrorMessages.NOTIFICATION.NOTI_NOT_FOUND);
      }
    } catch (error) {
      console.log(error.code);
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(
            ErrorMessages.NOTIFICATION.NOTI_NOT_FOUND,
          );
        }
      }
      throw error;
    }
  }
}
