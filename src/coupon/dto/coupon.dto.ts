import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class CreateCouponDto {
  @Expose()
  @ApiProperty({ type: Number, nullable: false, required: true })
  userId: number;

  @Expose()
  @ApiProperty({ type: Number, nullable: false, required: true })
  discountPercent: number;
}

export class UpdateCouponDto {
  @Expose()
  @ApiProperty({ type: Number, nullable: false, required: true })
  discountPercent: number;
}
