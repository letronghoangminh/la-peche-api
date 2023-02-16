import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class NotificationModel {
  @Expose()
  @ApiProperty({ type: Number })
  id: number;

  @Expose()
  @ApiProperty({ type: Number })
  userId: number;

  @Expose()
  @ApiProperty({ type: String })
  status: string;

  @Expose()
  @ApiProperty({ type: String })
  text: string;

  @Expose()
  @ApiProperty({ type: Date })
  createdAt: Date;

  @Expose()
  @ApiProperty({ type: Date })
  updatedAt: Date;
}

export class DeleteNotificationModel {
  @Expose()
  @ApiProperty({ type: Number })
  count: number;
}

export class BaseModel {
  @Expose()
  @ApiProperty({ type: Boolean })
  status: boolean;

  @Expose()
  @ApiProperty({ type: String })
  message: string;
}
