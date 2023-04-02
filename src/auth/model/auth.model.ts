import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class AuthModel {
  @Expose()
  @ApiProperty({ type: String })
  accessToken: string;

  @Expose()
  @ApiProperty({ type: String })
  refreshToken: string;
}
