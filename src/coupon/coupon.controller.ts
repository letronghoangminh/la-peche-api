import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { user } from '@prisma/client';
import { GetUser } from 'src/auth/decorator/get-user.decorator';
import { AdminGuard, UserGuard } from 'src/auth/guard/auth.guard';
import { APISummaries } from 'src/helpers/helpers';
import { CreateCouponDto, UpdateCouponDto } from './dto/coupon.dto';
import { CouponModel } from './model/coupon.model';
import { CouponService } from './coupon.service';
import { PageDto } from 'src/prisma/helper/prisma.helper';

type UserType = Pick<user, 'role' | 'id'>;

@Controller('coupons')
@ApiTags('COUPONS')
export class CouponController {
  constructor(private couponService: CouponService) {}

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: APISummaries.USER })
  @ApiOkResponse({ type: CouponModel })
  @ApiBearerAuth()
  @UseGuards(UserGuard)
  @Get()
  getAllCoupons(
    @Query(new ValidationPipe({ transform: true })) query: PageDto,
    @GetUser() user: UserType,
  ): Promise<CouponModel[]> {
    return this.couponService.getAllCoupons(query, {
      role: user.role,
      id: user.id,
    });
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: APISummaries.USER })
  @ApiOkResponse({ type: CouponModel })
  @ApiBearerAuth()
  @UseGuards(UserGuard)
  @Get(':id')
  getCouponById(
    @GetUser() user: UserType,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<CouponModel> {
    return this.couponService.getCouponById(id, {
      role: user.role,
      id: user.id,
    });
  }

  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: APISummaries.ADMIN })
  @ApiOkResponse({ type: CouponModel })
  @ApiBearerAuth()
  @UseGuards(AdminGuard)
  @Post()
  createCoupon(@Body() dto: CreateCouponDto): Promise<CouponModel> {
    return this.couponService.createCoupon(dto);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: APISummaries.ADMIN })
  @ApiOkResponse({ type: CouponModel })
  @ApiBearerAuth()
  @UseGuards(AdminGuard)
  @Delete(':id')
  deleteCouponById(
    @GetUser() user: UserType,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ count: number }> {
    return this.couponService.deleteCouponById(id);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: APISummaries.ADMIN })
  @ApiOkResponse({ type: CouponModel })
  @ApiBearerAuth()
  @UseGuards(AdminGuard)
  @Put(':id')
  updateCouponById(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCouponDto,
  ): Promise<CouponModel> {
    return this.couponService.updateCouponById(id, dto);
  }
}
