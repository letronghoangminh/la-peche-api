import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginDto, RegisterDto, VerifyUserDto } from './dto/auth.dto';
import * as argon from 'argon2';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Prisma, user } from '@prisma/client';
import { genRandomString, introShownFields } from 'src/helpers/helpers';
import { pick } from 'lodash';
import { ErrorMessages } from 'src/helpers/helpers';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
    private jwt: JwtService,
  ) {}

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

  async signToken(user: user): Promise<{ token: string }> {
    const pickedFields: string[] = ['id', 'email', 'name', 'role', 'username'];
    const payload = pick(user, pickedFields);

    const jwtSecret = this.config.get('JWT_SECRET');

    const token: string = await this.jwt.signAsync(payload, {
      expiresIn: '60m',
      secret: jwtSecret,
    });

    return {
      token: token,
    };
  }
}
