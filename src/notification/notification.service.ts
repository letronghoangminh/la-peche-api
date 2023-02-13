import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { NotificationStatus } from 'src/auth/enum/notification-status.enum';
import { Role } from 'src/auth/enum/role.enum';
import { ErrorMessages } from 'src/helpers/helpers';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  CreateNotifcationDto,
  UpdateNofiticationDto,
} from './dto/notification.dto';
import { NotificationModel } from './model/notification.model';

@Injectable()
export class NotificationService {
  constructor(private prismaService: PrismaService) {}

  async getAllNotifications(): Promise<NotificationModel[]> {
    return await this.prismaService.notification.findMany();
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
}
