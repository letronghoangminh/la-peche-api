import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class CouponModel {
  @Expose()
  @ApiProperty({ type: Number })
  id: number;

  @Expose()
  @ApiProperty({ type: Number })
  userId: number;

  @Expose()
  @ApiProperty({ type: String })
  code: string;

  @Expose()
  @ApiProperty({ type: Number })
  discountPercent: number;

  @Expose()
  @ApiProperty({ type: Boolean })
  isUsed: boolean;

  @Expose()
  @ApiProperty({ type: Date })
  createdAt: Date;

  @Expose()
  @ApiProperty({ type: Date })
  updatedAt: Date;
}

export class DeleteCouponModel {
  @Expose()
  @ApiProperty({ type: Number })
  count: number;
}
