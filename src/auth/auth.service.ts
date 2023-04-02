import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  LoginDto,
  RefreshTokenDto,
  RegisterDto,
  RequestResetPasswordDto,
  ResetPasswordDto,
  VerifyUserDto,
} from './dto/auth.dto';
import * as argon from 'argon2';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Prisma, user } from '@prisma/client';
import { genRandomString, introShownFields } from 'src/helpers/helpers';
import { pick } from 'lodash';
import { ErrorMessages } from 'src/helpers/helpers';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
    private jwt: JwtService,
    private mailService: MailService,
  ) {}

  private readonly jwtSecret = this.config.get('JWT_SECRET');

  async register(dto: RegisterDto) {
    const hashedPassword = await argon.hash(dto.password);
    try {
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          username: dto.username,
          hashedPassword: hashedPassword,
          introShownFields: introShownFields,
          name: dto.name,
          gender: '',
          status: '',
          orientation: '',
          verifyToken: genRandomString(20),
        },
      });

      return this.signToken(user);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credentials taken');
        }
      }
      throw error;
    }
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        username: dto.username,
      },
      include: {
        userImages: {
          select: {
            url: true,
          },
          where: {
            isThumbnail: true,
          },
        },
      },
    });

    if (!user)
      throw new ForbiddenException(ErrorMessages.AUTH.CREDENTIALS_INCORRECT);
    if (user.isDeleted)
      throw new ForbiddenException(ErrorMessages.AUTH.CREDENTIALS_INCORRECT);
    if (!user.isActivated)
      throw new ForbiddenException(ErrorMessages.AUTH.USER_INACTIVE);

    const passwordMatches = await argon.verify(
      user.hashedPassword,
      dto.password,
    );

    if (!passwordMatches)
      throw new ForbiddenException(ErrorMessages.AUTH.CREDENTIALS_INCORRECT);

    if (user.userImages[0]) user['avatarUrl'] = user.userImages[0].url;

    return this.signToken(user);
  }

  async verify(
    query: VerifyUserDto,
    options: {
      email: string;
      username: string;
    },
  ) {
    const user = await this.prisma.user.findUnique({
      where: {
        username: options.username,
      },
      select: {
        verifyToken: true,
      },
    });

    if (query.token === user.verifyToken) {
      await this.prisma.user.update({
        where: {
          username: options.username,
        },
        data: {
          isVerified: true,
          verifyAt: new Date(),
        },
      });

      return 'User verified successfully';
    }

    return 'Verify user failed';
  }

  async resetPasswordRequest(dto: RequestResetPasswordDto): Promise<void> {
    const resetToken = genRandomString(10);

    const user = await this.prisma.user.findFirst({
      where: {
        email: dto.email,
      },
    });

    if (!user) return;

    await this.prisma.user.update({
      data: {
        resetToken: resetToken,
      },
      where: {
        email: dto.email,
      },
    });

    await this.mailService.sendResetPasswordEmail(
      {
        email: user.email,
        name: user.name,
      },
      resetToken,
    );
  }

  async resetPassword(dto: ResetPasswordDto): Promise<void> {
    const user = await this.prisma.user.findFirst({
      where: {
        resetToken: dto.token,
      },
    });

    if (!user) throw new BadRequestException(ErrorMessages.AUTH.INVALID_TOKEN);

    const hashedPassword = await argon.hash(dto.password);

    await this.prisma.user.update({
      data: {
        hashedPassword: hashedPassword,
        resetToken: null,
      },
      where: {
        email: user.email,
      },
    });
  }

  async signToken(
    user: user,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const pickedFields: string[] = [
      'id',
      'email',
      'name',
      'role',
      'username',
      'avatarUrl',
    ];
    const payload = pick(user, pickedFields);

    const accessToken: string = await this.jwt.signAsync(payload, {
      expiresIn: '60m',
      secret: this.jwtSecret,
    });

    const refreshToken: string = await this.jwt.signAsync(payload, {
      expiresIn: '7d',
      secret: this.jwtSecret,
    });

    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }

  async refreshToken(dto: RefreshTokenDto) {
    const payload = await this.jwt.verify(dto.refreshToken, {
      secret: this.jwtSecret,
    });

    delete payload.iat;
    delete payload.exp;

    const accessToken: string = await this.jwt.signAsync(payload, {
      expiresIn: '60m',
      secret: this.jwtSecret,
    });

    return {
      accessToken: accessToken,
    };
  }
}
