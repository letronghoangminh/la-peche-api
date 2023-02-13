import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsIn } from 'class-validator';
import { NotificationStatus } from 'src/auth/enum/notification-status.enum';

export class CreateNotifcationDto {
  @Expose()
  @ApiProperty({ type: String, nullable: false, required: true })
  text: string;

  @Expose()
  @ApiProperty({ type: Number, nullable: false, required: true })
  userId: number;
}

export class UpdateNofiticationDto {
  @Expose()
  @ApiProperty({ type: String, nullable: false, required: true })
  text: string;

  @IsIn(['READ', 'UNREAD'])
  @Expose()
  @ApiProperty({ type: String, nullable: false, required: true })
  status: NotificationStatus;
}
