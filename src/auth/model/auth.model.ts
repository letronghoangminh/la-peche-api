import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class LoginModel {
  @Expose()
  @ApiProperty({ type: String })
  token: string;
}
