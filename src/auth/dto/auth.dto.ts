import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ type: String, required: true, nullable: false })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String, required: true, nullable: false })
  @Matches(/^[a-zA-Z0-9_ ]{6,20}$/)
  name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String, required: true, nullable: false })
  @Matches(/^[a-zA-Z0-9_]{6,20}$/)
  username: string;

  @IsNotEmpty()
  @ApiProperty({ type: String, required: true, nullable: false })
  @IsString()
  @MinLength(6)
  @MaxLength(20)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password too weak',
  })
  password: string;
}

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String, required: true, nullable: false })
  username: string;

  @IsNotEmpty()
  @ApiProperty({ type: String, required: true, nullable: false })
  @IsString()
  password: string;
}

export class VerifyUserDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String, required: true, nullable: false })
  token: string;
}

export class RefreshTokenDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String, required: true, nullable: false })
  refreshToken: string;
}
