import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { Role } from 'src/enum/role.enum';

export class UserModel {
  @Expose()
  @ApiProperty({ type: Number })
  id: number;

  @Expose()
  @ApiProperty({ type: String })
  username: string;

  @Expose()
  @ApiProperty({ type: Number })
  cluster: number;

  @Expose()
  @ApiProperty({ type: Boolean })
  isActivated: boolean;

  @Expose()
  @ApiProperty({ type: Boolean })
  isDeleted: boolean;

  @Expose()
  @ApiProperty({ type: Date })
  verifyAt: Date;

  @Expose()
  @ApiProperty({ type: Date })
  premiumEndsAt: Date;

  @Expose()
  @ApiProperty({ type: Date })
  createdAt: Date;

  @Expose()
  @ApiProperty({ type: Date })
  updatedAt: Date;

  @Expose()
  @ApiProperty({ type: Date })
  lastOnline: Date;

  @Expose()
  @ApiProperty({ type: String })
  role: Role;

  @Expose()
  @ApiProperty({ type: String })
  name: string;

  @Expose()
  @ApiProperty({ type: String })
  gender: string;

  @Expose()
  @ApiProperty({ type: String })
  status: string;

  @Expose()
  @ApiProperty({ type: String })
  orientation: string;

  @Expose()
  @ApiProperty({ type: String })
  biographic: string;

  @Expose()
  @ApiProperty({ type: String })
  email: string;

  @Expose()
  @ApiProperty({ type: String })
  phoneNumber: string;

  @Expose()
  @ApiProperty({ type: Number })
  yearOfBirth: number;

  @Expose()
  @ApiProperty({ type: String })
  bodyType: string;

  @Expose()
  @ApiProperty({ type: String })
  diet: string;

  @Expose()
  @ApiProperty({ type: String })
  drinks: string;

  @Expose()
  @ApiProperty({ type: String })
  drugs: string;

  @Expose()
  @ApiProperty({ type: String })
  education: string;

  @Expose()
  @ApiProperty({ type: String })
  ethnicity: string;

  @Expose()
  @ApiProperty({ type: Number })
  height: number;

  @Expose()
  @ApiProperty({ type: Number })
  income: number;

  @Expose()
  @ApiProperty({ type: String })
  job: string;

  @Expose()
  @ApiProperty({ type: String })
  location: string;

  @Expose()
  @ApiProperty({ type: String })
  offspring: string;

  @Expose()
  @ApiProperty({ type: String })
  pets: string;

  @Expose()
  @ApiProperty({ type: String })
  sign: string;

  @Expose()
  @ApiProperty({ type: String })
  smokes: string;

  @Expose()
  @ApiProperty({ type: String })
  speaks: string;
}

export class ImageModel {
  @Expose()
  @ApiProperty({ type: Number })
  id: string;

  @Expose()
  @ApiProperty({ type: String })
  url: string;

  @Expose()
  @ApiProperty({ type: Boolean })
  isThumbnail: boolean;

  @Expose()
  @ApiProperty({ type: Date })
  createdAt: Date;

  @Expose()
  @ApiProperty({ type: Date })
  updatedAt: Date;
}
