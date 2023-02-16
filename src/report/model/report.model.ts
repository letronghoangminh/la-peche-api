import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ReportModel {
  @Expose()
  @ApiProperty({ type: Number })
  id: number;

  @Expose()
  @ApiProperty({ type: String })
  reporterName: string;

  @Expose()
  @ApiProperty({ type: String })
  targetName: string;

  @Expose()
  @ApiProperty({ type: String })
  category: string;

  @Expose()
  @ApiProperty({ type: String })
  reason: string;

  @Expose()
  @ApiProperty({ type: Date })
  createdAt: Date;

  @Expose()
  @ApiProperty({ type: Date })
  updatedAt: Date;
}
