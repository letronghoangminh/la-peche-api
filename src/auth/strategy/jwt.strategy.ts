import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { Role } from '../../enum/role.enum';

@Injectable()
export class UserStrategy extends PassportStrategy(Strategy, 'user') {
  constructor(config: ConfigService, private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get('JWT_SECRET'),
    });
  }

  async validate(payload: { email: string }) {
    const user = await this.prisma.user.findFirst({
      where: {
        email: payload.email,
        isDeleted: false,
      },
    });

    if (!user) return null;

    delete user.hashedPassword;
    if (user.role === Role.USER || user.role === Role.ADMIN) return user;
  }
}

@Injectable()
export class AdminStrategy extends PassportStrategy(Strategy, 'admin') {
  constructor(config: ConfigService, private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get('JWT_SECRET'),
    });
  }

  async validate(payload: { email: string }) {
    const user = await this.prisma.user.findFirst({
      where: {
        email: payload.email,
        isDeleted: false,
      },
    });

    if (!user) return null;

    delete user.hashedPassword;
    if (user.role === Role.ADMIN) return user;
  }
}
