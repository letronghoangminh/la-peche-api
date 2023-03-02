import { BadRequestException, Injectable } from '@nestjs/common';
import { Role } from 'src/enum/role.enum';
import { ErrorMessages, Messages, PlainToInstance } from 'src/helpers/helpers';
import { MailService } from 'src/mail/mail.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateImageDto, UpdateImageDto, UpdateUserDto } from './dto/user.dto';
import { ImageModel, UserModel } from './model/user.model';

@Injectable()
export class UserService {
  constructor(
    private prismaService: PrismaService,
    private mailService: MailService,
  ) {}

  private async checkVerifiedUser(username: string): Promise<boolean> {
    const user = await this.prismaService.user.findFirst({
      where: {
        username: username,
        isDeleted: false,
      },
      select: {
        isVerified: true,
      },
    });

    return user.isVerified;
  }

  async getAllUsers(): Promise<UserModel[]> {
    const users = await this.prismaService.user.findMany({
      where: {
        isDeleted: false,
      },
    });

    return PlainToInstance(UserModel, users);
  }

  async getUserByUsername(
    username: string,
    user: {
      role: string;
      username: string;
    },
  ): Promise<UserModel> {
    const condition = {
      isDeleted: false,
    };

    if (
      (user.role === Role.USER && username === user.username) ||
      (user.role === Role.ADMIN && username)
    )
      condition['username'] = username;
    else throw new BadRequestException(ErrorMessages.USER.USER_INVALID);

    const result = await this.prismaService.user.findFirst({
      where: condition,
    });

    return PlainToInstance(UserModel, result);
  }

  async updateUser(
    username: string,
    dto: UpdateUserDto,
    user: {
      role: string;
      username: string;
    },
  ): Promise<UserModel> {
    const condition = {
      isDeleted: false,
    };

    if (
      (user.role === Role.USER && username === user.username) ||
      (user.role === Role.ADMIN && username)
    )
      condition['username'] = username;
    else throw new BadRequestException(ErrorMessages.USER.USER_INVALID);

    const updatedUser = await this.prismaService.user.updateMany({
      where: condition,
      data: dto,
    });

    return PlainToInstance(UserModel, updatedUser[0]);
  }

  async deleteUser(
    username: string,
    user: {
      role: string;
      username: string;
    },
  ): Promise<string> {
    const condition = {
      isDeleted: false,
    };

    if (
      (user.role === Role.USER && username === user.username) ||
      (user.role === Role.ADMIN && username)
    )
      condition['username'] = username;
    else throw new BadRequestException(ErrorMessages.USER.USER_INVALID);

    const deletedUsersCount = (
      await this.prismaService.user.updateMany({
        where: condition,
        data: {
          isDeleted: true,
        },
      })
    ).count;

    if (deletedUsersCount === 1)
      return 'This user has been deleted successfully';
    else
      throw new BadRequestException(
        'Username not match or user is already deleted',
      );
  }

  async likeUser(
    username: string,
    user: {
      role: string;
      username: string;
    },
  ): Promise<string> {
    if (!this.checkVerifiedUser(user.username))
      throw new BadRequestException(ErrorMessages.USER.USER_INACTIVE);

    if (username === user.username)
      throw new BadRequestException(ErrorMessages.USER.USER_INVALID);

    const targetUser = await this.prismaService.user.findFirst({
      where: {
        username: username,
        isActivated: true,
        isDeleted: false,
      },
      select: {
        liking: {
          select: {
            username: true,
          },
        },
        username: true,
      },
    });

    if (!targetUser)
      throw new BadRequestException(ErrorMessages.USER.USER_NOT_FOUND);

    const existedLikedUser = await this.prismaService.user.findFirst({
      where: {
        liking: {
          some: {
            username: username,
          },
        },
        username: user.username,
      },
    });

    if (existedLikedUser)
      throw new BadRequestException(ErrorMessages.USER.USER_LIKED);

    await this.prismaService.user.update({
      where: {
        username: user.username,
      },
      data: {
        liking: {
          connect: {
            username: username,
          },
        },
      },
    });

    Promise.all(
      targetUser.liking.map(async (likedUser) => {
        if (likedUser.username === user.username) {
          await this.prismaService.match.create({
            data: {
              firstUsername: targetUser.username,
              secondUsername: user.username,
            },
          });
        }
      }),
    );

    return Messages.USER.USER_LIKED;
  }

  async starUser(
    username: string,
    user: {
      role: string;
      username: string;
    },
  ): Promise<string> {
    if (!this.checkVerifiedUser(user.username))
      throw new BadRequestException(ErrorMessages.USER.USER_INACTIVE);

    if (username === user.username)
      throw new BadRequestException(ErrorMessages.USER.USER_INVALID);

    const targetUser = await this.prismaService.user.findFirst({
      where: {
        username: username,
        isActivated: true,
        isDeleted: true,
      },
      select: {
        staring: {
          select: {
            username: true,
          },
        },
        username: true,
      },
    });

    if (!targetUser)
      throw new BadRequestException(ErrorMessages.USER.USER_NOT_FOUND);

    const existedLikedUser = await this.prismaService.user.findFirst({
      where: {
        staring: {
          some: {
            username: username,
          },
        },
        username: user.username,
      },
    });

    if (existedLikedUser)
      throw new BadRequestException(ErrorMessages.USER.USER_STARRED);

    await this.prismaService.user.update({
      where: {
        username: user.username,
      },
      data: {
        staring: {
          connect: {
            username: username,
          },
        },
      },
    });

    return Messages.USER.USER_STARRED;
  }

  async getAllImages(user: {
    role: string;
    username: string;
    userId: number;
  }): Promise<ImageModel[]> {
    const condition = {};

    if (user.role === Role.USER) condition['userId'] = user.userId;

    const userImages = await this.prismaService.user_image.findMany({
      where: condition,
    });

    return PlainToInstance(ImageModel, userImages);
  }

  async createImage(
    dto: CreateImageDto,
    user: {
      role: string;
      username: string;
      userId: number;
    },
  ): Promise<ImageModel> {
    const userImage = await this.prismaService.user_image.create({
      data: {
        userId: user.userId,
        isThumbnail: dto.isThumbnail,
        url: dto.url,
      },
    });

    return PlainToInstance(ImageModel, userImage);
  }

  async deleteImageById(
    id: number,
    user: {
      role: string;
      username: string;
      userId: number;
    },
  ): Promise<ImageModel> {
    const image = await this.prismaService.user_image.findFirst({
      where: {
        id: id,
        userId: user.userId,
      },
    });

    if (!image)
      throw new BadRequestException(ErrorMessages.USER.USER_IMAGE_NOT_EXIST);

    const userImage = await this.prismaService.user_image.delete({
      where: {
        id: id,
      },
    });

    return PlainToInstance(ImageModel, userImage);
  }

  async updateImageById(
    id: number,
    dto: UpdateImageDto,
    user: {
      role: string;
      username: string;
      userId: number;
    },
  ): Promise<ImageModel> {
    const image = await this.prismaService.user_image.findFirst({
      where: {
        id: id,
        userId: user.userId,
      },
    });

    if (!image)
      throw new BadRequestException(ErrorMessages.USER.USER_IMAGE_NOT_EXIST);

    const userImage = await this.prismaService.user_image.update({
      where: {
        id: id,
      },
      data: dto,
    });

    return PlainToInstance(ImageModel, userImage);
  }

  async verifyUser(user: { email: string; username: string }): Promise<string> {
    const existedUser = await this.prismaService.user.findFirst({
      where: {
        username: user.username,
      },
      select: {
        name: true,
        verifyToken: true,
      },
    });

    this.mailService.sendEmailConfirmation(
      { email: user.email, name: existedUser.name },
      existedUser.verifyToken,
    );

    return 'Verification email sended';
  }
}
