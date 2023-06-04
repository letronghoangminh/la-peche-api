import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import {
  IsBoolean,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
} from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @ApiProperty({ type: Boolean, default: false })
  init: boolean;

  @IsOptional()
  @Expose()
  @ApiProperty({ type: String })
  @Matches(/^[a-zA-Z0-9_ ]{6,20}$/)
  name: string;

  @IsOptional()
  @Expose()
  @ApiProperty({ type: String })
  gender: string;

  @IsOptional()
  @Expose()
  @ApiProperty({ type: String })
  status: string;

  @IsOptional()
  @Expose()
  @ApiProperty({ type: String })
  orientation: string;

  @IsOptional()
  @Expose()
  @ApiProperty({ type: String })
  biographic: string;

  @IsOptional()
  @Expose()
  @ApiProperty({ type: Number })
  yearOfBirth: number;

  @IsOptional()
  @Expose()
  @ApiProperty({ type: String })
  bodyType: string;

  @IsOptional()
  @Expose()
  @ApiProperty({ type: String })
  diet: string;

  @IsOptional()
  @Expose()
  @ApiProperty({ type: String })
  drinks: string;

  @IsOptional()
  @Expose()
  @ApiProperty({ type: String })
  drugs: string;

  @IsOptional()
  @Expose()
  @ApiProperty({ type: String })
  education: string;

  @IsOptional()
  @Expose()
  @ApiProperty({ type: String })
  ethnicity: string;

  @IsOptional()
  @Expose()
  @ApiProperty({ type: Number })
  height: number;

  @IsOptional()
  @Expose()
  @ApiProperty({ type: Number })
  income: number;

  @IsOptional()
  @Expose()
  @ApiProperty({ type: String })
  job: string;

  @IsOptional()
  @Expose()
  @ApiProperty({ type: String })
  location: string;

  @IsOptional()
  @Expose()
  @ApiProperty({ type: String })
  offspring: string;

  @IsOptional()
  @Expose()
  @ApiProperty({ type: String })
  pets: string;

  @IsOptional()
  @Expose()
  @ApiProperty({ type: String })
  sign: string;

  @IsOptional()
  @Expose()
  @ApiProperty({ type: String })
  smokes: string;

  @IsOptional()
  @Expose()
  @ApiProperty({ type: String })
  speaks: string;
}

export class CreateImageDto {
  @Expose()
  @IsString()
  @IsUrl()
  @ApiProperty({ type: String, required: true, nullable: false })
  url: string;

  @Expose()
  @IsBoolean()
  @ApiProperty({ type: Boolean, required: true, nullable: false })
  isThumbnail: boolean;
}

export class UpdateImageDto {
  @Expose()
  @IsString()
  @IsUrl()
  @ApiProperty({ type: String, required: true, nullable: false })
  url: string;

  @Expose()
  @IsString()
  @ApiProperty({ type: Boolean, required: true, nullable: false })
  isThumbnail: boolean;
}

export class LikeUserDto {
  @IsString()
  @ApiProperty({ type: String, required: true, nullable: false })
  username: string;
}

export class StarUserDto extends LikeUserDto {}

export class SkipUserDto extends LikeUserDto {}

export class UpdateIntoShownFieldsDto {
  @IsOptional()
  @IsBoolean()
  @ApiProperty({ type: Boolean, required: false })
  yearOfBirth?: boolean;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ type: Boolean, required: false })
  bodyType: boolean;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ type: Boolean, required: false })
  diet: boolean;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ type: Boolean, required: false })
  drinks: boolean;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ type: Boolean, required: false })
  drugs: boolean;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ type: Boolean, required: false })
  education: boolean;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ type: Boolean, required: false })
  ethnicity: boolean;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ type: Boolean, required: false })
  height: boolean;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ type: Boolean, required: false })
  income: boolean;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ type: Boolean, required: false })
  job: boolean;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ type: Boolean, required: false })
  location: boolean;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ type: Boolean, required: false })
  offspring: boolean;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ type: Boolean, required: false })
  pets: boolean;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ type: Boolean, required: false })
  sign: boolean;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ type: Boolean, required: false })
  smokes: boolean;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ type: Boolean, required: false })
  speaks: boolean;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ type: Boolean, required: false })
  email: boolean;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ type: Boolean, required: false })
  phoneNumber: boolean;
}
