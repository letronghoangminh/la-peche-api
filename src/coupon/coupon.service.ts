import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Role } from 'src/enum/role.enum';
import { ErrorMessages, genCouponCode } from 'src/helpers/helpers';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCouponDto, UpdateCouponDto } from './dto/Coupon.dto';
import { CouponModel } from './model/Coupon.model';

@Injectable()
export class CouponService {
  constructor(private prismaService: PrismaService) {}

  async getAllCoupons(): Promise<CouponModel[]> {
    return await this.prismaService.coupon.findMany();
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

    return coupon;
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
    return coupon;
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
      return await this.prismaService.coupon.update({
        where: {
          id: id,
        },
        data: {
          discountPercent: dto.discountPercent,
        },
      });
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
