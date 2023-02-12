import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import * as argon from 'argon2';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Prisma, user } from '@prisma/client';
import { introShownFields } from 'src/helpers/helpers';
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
          hashedPassword: hashedPassword,
          introShownFields: introShownFields,
          name: dto.name,
          gender: '',
          status: '',
          orientation: '',
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
        email: dto.email,
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

  async signToken(user: user): Promise<{ token: string }> {
    const pickedFields: string[] = ['id', 'email', 'name', 'role'];
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
