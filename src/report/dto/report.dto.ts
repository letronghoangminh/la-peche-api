import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsIn, IsString } from 'class-validator';
import { ReportStatus } from 'src/enum/report-status.enum';

export class ReportDto {
  @IsString()
  @Expose()
  @ApiProperty({ type: String, nullable: false, required: true })
  reporterName: string;

  @IsString()
  @Expose()
  @ApiProperty({ type: String, nullable: false, required: true })
  targetName: string;

  @Expose()
  @IsString()
  @ApiProperty({ type: String, nullable: false, required: true })
  category: string;

  @Expose()
  @IsString()
  @ApiProperty({ type: String, nullable: false, required: true })
  reason: string;
}

export class HandleReportDto {
  @Expose()
  @IsString()
  @ApiProperty({ type: String, nullable: false, required: true })
  category: string;

  @Expose()
  @IsString()
  @ApiProperty({ type: String, nullable: false, required: true })
  reason: string;

  @IsIn(Object.values(ReportStatus))
  @Expose()
  @IsString()
  @ApiProperty({ type: String, nullable: false, required: true })
  status: ReportStatus;
}
