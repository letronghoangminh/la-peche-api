import { BadRequestException, Injectable } from '@nestjs/common';
import { Role } from 'src/enum/role.enum';
import {
  ErrorMessages,
  Messages,
  PlainToInstance,
  genRandomString,
  sensitiveFields,
} from 'src/helpers/helpers';
import { MailService } from 'src/mail/mail.service';
import {
  OrderByHandle,
  PageDto,
  PaginationHandle,
} from 'src/prisma/helper/prisma.helper';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  ChangeImageOrderDto,
  CreateImageDto,
  GetRecommendedUsersDto,
  UpdateImageDto,
  UpdateIntoShownFieldsDto,
  UpdateUserDto,
} from './dto/user.dto';
import { ImageModel, UserDetailInfo, UserModel } from './model/user.model';
import { instanceToPlain } from 'class-transformer';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class UserService {
  private readonly recommendationSystemRoot: string;

  constructor(
    private prismaService: PrismaService,
    private mailService: MailService,
    private configService: ConfigService,
  ) {
    this.recommendationSystemRoot = this.configService.get('RS_ROOT');
  }

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

  private async removeUserFromPositiveLists(
    username: string,
    targetUsername: string,
    options: {
      like?: boolean;
      star?: boolean;
      recommend?: boolean;
      match?: boolean;
    },
  ): Promise<void> {
    if (options.like) {
      const likedUser = await this.prismaService.user.findFirst({
        where: {
          username: username,
          liking: {
            some: {
              username: targetUsername,
            },
          },
        },
      });

      if (likedUser)
        await this.prismaService.user.update({
          where: {
            username: username,
          },
          data: {
            liking: {
              disconnect: {
                username: targetUsername,
              },
            },
          },
        });
    }

    if (options.star) {
      const starredUser = await this.prismaService.user.findFirst({
        where: {
          username: username,
          staring: {
            some: {
              username: targetUsername,
            },
          },
        },
      });

      if (starredUser)
        await this.prismaService.user.update({
          where: {
            username: username,
          },
          data: {
            staring: {
              disconnect: {
                username: targetUsername,
              },
            },
          },
        });
    }

    if (options.recommend) {
      const recommendedUser = await this.prismaService.user.findFirst({
        where: {
          username: username,
          recommendedUsers: {
            some: {
              username: targetUsername,
            },
          },
        },
      });

      if (recommendedUser)
        await this.prismaService.user.update({
          where: {
            username: username,
          },
          data: {
            recommendedUsers: {
              disconnect: {
                username: targetUsername,
              },
            },
          },
        });
    }

    if (options.match) {
      const matchedUser = await this.prismaService.user.findFirst({
        where: {
          username: username,
          matching: {
            some: {
              username: targetUsername,
            },
          },
        },
      });

      if (matchedUser) {
        await this.prismaService.user.update({
          where: {
            username: username,
          },
          data: {
            matching: {
              disconnect: {
                username: targetUsername,
              },
            },
          },
        });

        await this.prismaService.user.update({
          where: {
            username: targetUsername,
          },
          data: {
            matching: {
              disconnect: {
                username: username,
              },
            },
          },
        });
      }
    }
  }

  private async removeUserFromNegativeLists(
    username: string,
    targetUsername: string,
  ): Promise<void> {
    const skippedUser = await this.prismaService.user.findFirst({
      where: {
        username: username,
        skipping: {
          some: {
            username: targetUsername,
          },
        },
      },
    });

    if (skippedUser)
      await this.prismaService.user.update({
        where: {
          username: username,
        },
        data: {
          skipping: {
            disconnect: {
              username: targetUsername,
            },
          },
        },
      });
  }

  async getAllUsers(query: PageDto): Promise<UserDetailInfo[]> {
    const dbQuery = {
      where: {
        isDeleted: false,
      },
      include: {
        userImages: true,
      },
    };

    PaginationHandle(dbQuery, query.page, query.pageSize);
    const users = await this.prismaService.user.findMany(dbQuery);

    return PlainToInstance(UserDetailInfo, users);
  }

  async getUserByUsername(
    username: string,
    user: {
      role: string;
      username: string;
    },
  ): Promise<UserModel> {
    let result: UserModel;
    if (
      (user.role === Role.USER && username === user.username) ||
      user.role === Role.ADMIN
    ) {
      const user = await this.prismaService.user.findFirst({
        where: {
          username: username,
          isDeleted: false,
        },
      });

      result = PlainToInstance(UserModel, user);
    } else {
      const user = await this.prismaService.user.findFirst({
        where: {
          username: username,
          isDeleted: false,
        },
      });

      if (user) {
        for (const [key, value] of Object.entries(user.introShownFields)) {
          if (!value) delete user[key];
        }

        sensitiveFields.map((field) => {
          delete user[field];
        });
      }

      result = PlainToInstance(UserModel, user);
    }

    if (!result) throw new BadRequestException(ErrorMessages.USER.USER_INVALID);

    return result;
  }

  async updateUser(
    username: string,
    dto: UpdateUserDto,
    user: {
      role: string;
      username: string;
    },
  ): Promise<UserModel> {
    const initRSRegister = dto.init;

    delete dto.init;

    const condition = {
      isDeleted: false,
    };

    if (
      (user.role === Role.USER && username === user.username) ||
      (user.role === Role.ADMIN && username)
    )
      condition['username'] = username;
    else throw new BadRequestException(ErrorMessages.USER.USER_INVALID);

    if (dto.location) dto['provinceCode'] = dto.location.split(',')[0];

    await this.prismaService.user.updateMany({
      where: condition,
      data: dto,
    });

    const updatedUser = await this.prismaService.user.findFirst({
      where: condition,
    });

    if (initRSRegister) {
      const registerToRSData = {
        status: dto.status,
        body_type: dto.bodyType,
        diet: dto.diet,
        drinks: dto.drinks,
        drugs: dto.drugs,
        education: dto.education,
        ethnicity: dto.ethnicity,
        job: dto.job,
        offspring: dto.offspring,
        pets: dto.pets,
        religion: null,
        sign: dto.sign,
        smokes: dto.smokes,
        speaks: dto.speaks,
        age: new Date().getFullYear() - dto.yearOfBirth,
        biographic: dto.biographic,
      };

      axios.post(
        `${this.recommendationSystemRoot}/register`,
        JSON.stringify(registerToRSData),
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        },
      );
    }

    return PlainToInstance(UserModel, updatedUser);
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

  async banUser(username: string): Promise<string> {
    await this.prismaService.user.update({
      where: {
        username: username,
      },
      data: {
        isActivated: false,
      },
    });

    return Messages.USER.USER_BANNED;
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

    await Promise.all(
      targetUser.liking.map(async (likedUser) => {
        if (likedUser.username === user.username) {
          await this.prismaService.user.update({
            data: {
              matching: {
                connect: {
                  username: targetUser.username,
                },
              },
            },
            where: {
              username: user.username,
            },
          });

          await this.prismaService.notification.create({
            data: {
              text: `You have matched with ${targetUser.username}`,
              user: {
                connect: {
                  username: user.username,
                },
              },
            },
          });

          await this.prismaService.notification.create({
            data: {
              text: `You have matched with ${user.username}`,
              user: {
                connect: {
                  username: targetUser.username,
                },
              },
            },
          });

          await this.prismaService.user.update({
            data: {
              matching: {
                connect: {
                  username: user.username,
                },
              },
            },
            where: {
              username: targetUser.username,
            },
          });
        }
      }),
    );

    await this.removeUserFromNegativeLists(user.username, username);

    return Messages.USER.USER_LIKED;
  }

  async unlikeUser(
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

    if (!existedLikedUser)
      throw new BadRequestException(ErrorMessages.USER.USER_NOT_LIKED);

    await this.prismaService.user.update({
      where: {
        username: user.username,
      },
      data: {
        liking: {
          disconnect: {
            username: username,
          },
        },
      },
    });

    await this.removeUserFromPositiveLists(user.username, username, {
      like: true,
      match: true,
    });

    return Messages.USER.USER_UNLIKED;
  }

  async unstarUser(
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
        username: true,
      },
    });

    if (!targetUser)
      throw new BadRequestException(ErrorMessages.USER.USER_NOT_FOUND);

    const existedStarredUser = await this.prismaService.user.findFirst({
      where: {
        staring: {
          some: {
            username: username,
          },
        },
        username: user.username,
      },
    });

    if (!existedStarredUser)
      throw new BadRequestException(ErrorMessages.USER.USER_NOT_STARRED);

    await this.prismaService.user.update({
      where: {
        username: user.username,
      },
      data: {
        staring: {
          disconnect: {
            username: username,
          },
        },
      },
    });

    await this.removeUserFromPositiveLists(user.username, username, {
      star: true,
    });

    return Messages.USER.USER_UNSTARRED;
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
        isDeleted: false,
      },
      select: {
        username: true,
      },
    });

    if (!targetUser)
      throw new BadRequestException(ErrorMessages.USER.USER_NOT_FOUND);

    const existedStaredUser = await this.prismaService.user.findFirst({
      where: {
        staring: {
          some: {
            username: username,
          },
        },
        username: user.username,
      },
    });

    if (existedStaredUser)
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

    await this.removeUserFromNegativeLists(user.username, username);

    return Messages.USER.USER_STARRED;
  }

  async skipUser(
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
        username: true,
      },
    });

    if (!targetUser)
      throw new BadRequestException(ErrorMessages.USER.USER_NOT_FOUND);

    const existedSkippedUser = await this.prismaService.user.findFirst({
      where: {
        skipping: {
          some: {
            username: username,
          },
        },
        username: user.username,
      },
    });

    if (existedSkippedUser)
      throw new BadRequestException(ErrorMessages.USER.USER_SKIPPED);

    await this.prismaService.user.update({
      where: {
        username: user.username,
      },
      data: {
        skipping: {
          connect: {
            username: username,
          },
        },
      },
    });

    await this.removeUserFromPositiveLists(user.username, username, {
      like: true,
      star: true,
      recommend: true,
      match: true,
    });

    return Messages.USER.USER_SKIPPED;
  }

  async unskipUser(
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
        username: true,
      },
    });

    if (!targetUser)
      throw new BadRequestException(ErrorMessages.USER.USER_NOT_FOUND);

    const existedSkippedUser = await this.prismaService.user.findFirst({
      where: {
        skipping: {
          some: {
            username: username,
          },
        },
        username: user.username,
      },
    });

    if (!existedSkippedUser)
      throw new BadRequestException(ErrorMessages.USER.USER_NOT_SKIPPED);

    await this.prismaService.user.update({
      where: {
        username: user.username,
      },
      data: {
        skipping: {
          disconnect: {
            username: username,
          },
        },
      },
    });

    await this.removeUserFromNegativeLists(user.username, username);

    return Messages.USER.USER_UNSKIPPED;
  }

  async getAllImages(
    query: PageDto,
    user: {
      role: string;
      username: string;
      userId: number;
    },
  ): Promise<ImageModel[]> {
    const condition = {};

    if (user.role === Role.USER) condition['userId'] = user.userId;

    const dbQuery = {
      where: condition,
    };

    PaginationHandle(dbQuery, query.page, query.pageSize);
    const userImages = await this.prismaService.user_image.findMany(dbQuery);

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
        order: dto.order,
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

    await this.prismaService.user_image.updateMany({
      where: {
        userId: user.userId,
        order: {
          gt: image.order,
        },
      },
      data: {
        order: {
          decrement: 1,
        },
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
    const verifyToken = genRandomString(10);

    const existedUser = await this.prismaService.user.findFirst({
      where: {
        username: user.username,
      },
      select: {
        name: true,
      },
    });

    await this.prismaService.user.update({
      data: {
        verifyToken: verifyToken,
      },
      where: {
        username: user.username,
      },
    });

    this.mailService.sendEmailConfirmation(
      { email: user.email, name: existedUser.name },
      verifyToken,
    );

    return 'Verification email sended';
  }

  async getLikedUsers(
    query: PageDto,
    options: { username: string },
  ): Promise<UserDetailInfo[]> {
    const dbQuery = {
      where: {
        username: options.username,
      },
      select: {
        liking: {
          select: {
            username: true,
          },
        },
      },
    };

    PaginationHandle(dbQuery.select.liking, query.page, query.pageSize);
    const user = await this.prismaService.user.findFirst(dbQuery);

    const likedUsers: UserDetailInfo[] = [];

    await Promise.all(
      user.liking.map(async (likedUser) => {
        const user = await this.getUserInfoWithImagesByUsername(
          likedUser.username,
          {
            role: Role.USER,
            username: options.username,
          },
        );
        likedUsers.push(user);
      }),
    );

    return likedUsers;
  }

  async getLikedUsersCount(options: { username: string }): Promise<number> {
    const count = (
      await this.prismaService.user.findFirst({
        where: {
          username: options.username,
        },
        select: {
          liking: true,
        },
      })
    ).liking.length;

    return count;
  }

  async getStarredUsers(
    query: PageDto,
    options: { username: string },
  ): Promise<UserDetailInfo[]> {
    const dbQuery = {
      where: {
        username: options.username,
      },
      select: {
        staring: {
          select: {
            username: true,
          },
        },
      },
    };

    PaginationHandle(dbQuery.select.staring, query.page, query.pageSize);
    OrderByHandle(dbQuery, [{ createdAt: 'desc' }]);

    const user = await this.prismaService.user.findFirst(dbQuery);

    const starredUsers: UserDetailInfo[] = [];

    await Promise.all(
      user.staring.map(async (starredUser) => {
        const user = await this.getUserInfoWithImagesByUsername(
          starredUser.username,
          {
            role: Role.USER,
            username: options.username,
          },
        );
        starredUsers.push(user);
      }),
    );

    return starredUsers;
  }

  async getStarredUsersCount(options: { username: string }): Promise<number> {
    const count = (
      await this.prismaService.user.findFirst({
        where: {
          username: options.username,
        },
        select: {
          staring: true,
        },
      })
    ).staring.length;

    return count;
  }

  async getSkippedUsers(
    query: PageDto,
    options: { username: string },
  ): Promise<UserDetailInfo[]> {
    const dbQuery = {
      where: {
        username: options.username,
      },
      select: {
        skipping: {
          select: {
            username: true,
          },
        },
      },
    };

    PaginationHandle(dbQuery.select.skipping, query.page, query.pageSize);
    const user = await this.prismaService.user.findFirst(dbQuery);

    const skippedUsers: UserDetailInfo[] = [];

    await Promise.all(
      user.skipping.map(async (skippedUser) => {
        const user = await this.getUserInfoWithImagesByUsername(
          skippedUser.username,
          {
            role: Role.USER,
            username: options.username,
          },
        );
        skippedUsers.push(PlainToInstance(UserDetailInfo, user));
      }),
    );

    return skippedUsers;
  }

  async getSkippedUsersCount(options: { username: string }): Promise<number> {
    const count = (
      await this.prismaService.user.findFirst({
        where: {
          username: options.username,
        },
        select: {
          skipping: true,
        },
      })
    ).skipping.length;

    return count;
  }

  async getRecommendedUsers(
    query: GetRecommendedUsersDto,
    options: {
      username: string;
    },
  ): Promise<UserDetailInfo[]> {
    const user = await this.prismaService.user.findFirst({
      where: {
        username: options.username,
      },
      select: {
        id: true,
        location: true,
        gender: true,
        provinceCode: true,
        recommendedUsers: {
          select: {
            username: true,
          },
        },
        skipping: {
          select: {
            username: true,
          },
        },
        liking: {
          select: {
            username: true,
          },
        },
        staring: {
          select: {
            username: true,
          },
        },
      },
    });

    const skippedUsernames = user.skipping.map((user) => user.username);
    const likedUsernames = user.liking.map((user) => user.username);
    const starredUsernames = user.staring.map((user) => user.username);

    const extraCondition = {};

    if (user.provinceCode && user.location)
      extraCondition['provinceCode'] = {
        in: user.provinceCode,
      };

    const potentialUsers = await this.prismaService.user.findMany({
      where: {
        ...extraCondition,
        gender: {
          not: user.gender,
        },
        username: {
          notIn: skippedUsernames.concat(likedUsernames, starredUsernames),
        },
        isActivated: true,
        isDeleted: false,
      },
    });

    const potentialUserIds = potentialUsers.map((user) => user.id);

    const response = await axios.post(
      `${this.recommendationSystemRoot}/match?user_id=${user.id}`,
      potentialUserIds,
    );

    const recommendationData: number[] = JSON.parse(
      JSON.stringify(response.data),
    )['rank_list'];

    const recommendedUserIds = recommendationData.slice(0, query.quantity);

    const recommendedUsers = await this.prismaService.user.findMany({
      where: {
        id: {
          in: recommendedUserIds,
        },
      },
      select: {
        username: true,
        id: true,
      },
    });

    const recommendedResults: UserDetailInfo[] = [];

    await Promise.all(
      recommendedUsers.map(async (recommendedUser) => {
        const result = await this.getUserInfoWithImagesByUsername(
          recommendedUser.username,
          {
            role: Role.USER,
            username: options.username,
          },
        );

        await this.prismaService.user.update({
          where: {
            id: user.id,
          },
          data: {
            recommendedUsers: {
              connect: {
                id: recommendedUser.id,
              },
            },
          },
        });

        recommendedResults.push(result);
      }),
    );

    return recommendedResults;
  }

  async getMatchedUsers(
    query: PageDto,
    options: { username: string },
  ): Promise<UserDetailInfo[]> {
    const dbQuery = {
      where: {
        username: options.username,
      },
      select: {
        matching: {
          select: {
            username: true,
          },
        },
      },
    };

    PaginationHandle(dbQuery.select.matching, query.page, query.pageSize);
    OrderByHandle(dbQuery, [{ createdAt: 'desc' }]);
    const user = await this.prismaService.user.findFirst(dbQuery);

    const matchedUsers: UserDetailInfo[] = [];

    await Promise.all(
      user.matching.map(async (matchedUser) => {
        const user = await this.getUserInfoWithImagesByUsername(
          matchedUser.username,
          {
            role: Role.USER,
            username: options.username,
          },
        );
        matchedUsers.push(user);
      }),
    );

    return matchedUsers;
  }

  async getMatchedUsersCount(options: { username: string }): Promise<number> {
    const count = (
      await this.prismaService.user.findFirst({
        where: {
          username: options.username,
        },
        select: {
          matched: true,
        },
      })
    ).matched.length;

    return count;
  }

  async getUserInfoWithImagesByUsername(
    username: string,
    user: {
      role: string;
      username: string;
    },
  ): Promise<UserDetailInfo> {
    let result: UserDetailInfo;
    if (
      (user.role === Role.USER && username === user.username) ||
      user.role === Role.ADMIN
    ) {
      const user = await this.prismaService.user.findFirst({
        where: {
          username: username,
          isDeleted: false,
        },
        include: {
          userImages: true,
        },
      });

      result = PlainToInstance(UserDetailInfo, user);
    } else {
      const user = await this.prismaService.user.findFirst({
        where: {
          username: username,
          isDeleted: false,
        },
        include: {
          userImages: true,
        },
      });

      if (user) {
        for (const [key, value] of Object.entries(user.introShownFields)) {
          if (!value) delete user[key];
        }

        sensitiveFields.map((field) => {
          delete user[field];
        });
      }

      result = PlainToInstance(UserDetailInfo, user);
    }

    if (!result) throw new BadRequestException(ErrorMessages.USER.USER_INVALID);

    return result;
  }

  async updateIntroShownFields(
    dto: UpdateIntoShownFieldsDto,
    user: {
      role: string;
      username: string;
    },
  ): Promise<void> {
    await this.prismaService.user.update({
      where: {
        username: user.username,
      },
      data: {
        introShownFields: instanceToPlain(dto),
      },
    });
  }

  async changeImageOrder(
    id: number,
    dto: ChangeImageOrderDto,
    user: {
      role: string;
      username: string;
      userId: number;
    },
  ): Promise<ImageModel> {
    const image = await this.prismaService.user_image.findFirst({
      where: {
        userId: user.userId,
        id: id,
      },
    });

    if (!image)
      throw new BadRequestException(ErrorMessages.USER.USER_IMAGE_NOT_EXIST);

    const largestOrderImage = await this.prismaService.user_image.findFirst({
      where: {
        userId: user.userId,
      },
      select: {
        order: true,
        id: true,
      },
      orderBy: {
        order: 'desc',
      },
    });

    const smallestOrderImage = await this.prismaService.user_image.findFirst({
      where: {
        userId: user.userId,
      },
      select: {
        order: true,
        id: true,
      },
      orderBy: {
        order: 'asc',
      },
    });

    const oldOrder = image.order;
    const largestOrder = largestOrderImage.order;
    const smallestOrder = smallestOrderImage.order;

    if (dto.order >= largestOrder) {
      dto.order = largestOrder;

      await this.prismaService.user_image.updateMany({
        where: {
          order: {
            gt: oldOrder,
          },
          userId: user.userId,
        },
        data: {
          order: {
            decrement: 1,
          },
        },
      });
    } else if (dto.order <= smallestOrder) {
      dto.order = smallestOrder;

      await this.prismaService.user_image.updateMany({
        where: {
          order: {
            lt: oldOrder,
          },
          userId: user.userId,
        },
        data: {
          order: {
            increment: 1,
          },
        },
      });
    } else if (oldOrder < dto.order) {
      await this.prismaService.user_image.updateMany({
        where: {
          order: {
            gt: oldOrder,
            lte: dto.order,
          },
          userId: user.userId,
        },
        data: {
          order: {
            decrement: 1,
          },
        },
      });
    } else if (oldOrder > dto.order) {
      await this.prismaService.user_image.updateMany({
        where: {
          order: {
            gte: dto.order,
            lt: oldOrder,
          },
          userId: user.userId,
        },
        data: {
          order: {
            increment: 1,
          },
        },
      });
    } else if (oldOrder == dto.order) return;

    await this.prismaService.user_image.update({
      where: {
        id: id,
      },
      data: {
        order: dto.order,
      },
    });

    return PlainToInstance(ImageModel, image);
  }
}
