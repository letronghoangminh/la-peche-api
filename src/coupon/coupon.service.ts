import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import { Role } from 'src/enum/role.enum';
import { ErrorMessages, genCouponCode } from 'src/helpers/helpers';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCouponDto, UpdateCouponDto } from './dto/coupon.dto';
import { CouponModel } from './model/coupon.model';

@Injectable()
export class CouponService {
  constructor(private prismaService: PrismaService) {}

  async getAllCoupons(user: {
    role: string;
    id: number;
  }): Promise<CouponModel[]> {
    if (user.role === Role.ADMIN)
      return plainToInstance(
        CouponModel,
        await this.prismaService.coupon.findMany(),
      );
    return plainToInstance(
      CouponModel,
      await this.prismaService.coupon.findMany({
        where: {
          userId: user.id,
        },
      }),
    );
  }

  async getCouponById(
    id: number,
    user: { role: string; id: number },
  ): Promise<CouponModel> {
    const condition = { id: id };

    if (!(user.role === Role.ADMIN)) condition['userId'] = user.id;

    const coupon = await this.prismaService.coupon.findFirst({
      where: condition,
    });

    if (!coupon)
      throw new NotFoundException(ErrorMessages.COUPON.COUPON_NOT_FOUND);

    return plainToInstance(CouponModel, coupon);
  }

  async createCoupon(dto: CreateCouponDto): Promise<CouponModel> {
    let couponCode: string;

    while (true) {
      couponCode = genCouponCode();

      const existedCoupon = await this.prismaService.coupon.findFirst({
        where: {
          code: couponCode,
        },
      });

      if (!existedCoupon) break;
    }

    const coupon = await this.prismaService.coupon.create({
      data: {
        userId: dto.userId,
        discountPercent: dto.discountPercent,
        code: couponCode,
      },
    });
    return plainToInstance(CouponModel, coupon);
  }

  async deleteCouponById(id: number): Promise<{ count: number }> {
    const coupon = await this.prismaService.coupon.deleteMany({
      where: {
        id: id,
      },
    });

    if (!coupon)
      throw new NotFoundException(ErrorMessages.COUPON.COUPON_NOT_FOUND);

    if (coupon.count == 0)
      throw new NotFoundException(ErrorMessages.COUPON.COUPON_NOT_FOUND);

    return { count: coupon.count };
  }

  async updateCouponById(
    id: number,
    dto: UpdateCouponDto,
  ): Promise<CouponModel> {
    try {
      const coupon = await this.prismaService.coupon.update({
        where: {
          id: id,
        },
        data: {
          discountPercent: dto.discountPercent,
        },
      });
      return plainToInstance(CouponModel, coupon);
    } catch (error) {
      console.log(error.code);
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(ErrorMessages.COUPON.COUPON_NOT_FOUND);
        }
      }
      throw error;
    }
  }
}
