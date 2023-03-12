import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export const PaginationHandle = (
  query: object,
  page: number,
  pageSize: number,
) => {
  if (page && pageSize) {
    query['take'] = Number(pageSize);
    query['skip'] = Number((page - 1) * pageSize);
  }
  return query;
};

export const OrderByHandle = (query: object, orderBy: Array<object>) => {
  if (!query['orderBy']) query['orderBy'] = orderBy;
  else {
    if (query['orderBy'] instanceof Object) query['orderBy'] = query['orderBy'];
    orderBy.forEach((obj) => {
      query['orderBy'].push(obj);
    });
  }
  return query;
};

export class PageDto {
  @Type(() => Number)
  @ApiProperty({
    type: 'integer',
    default: null,
    nullable: true,
    required: false,
  })
  page: number = null;

  @Type(() => Number)
  @ApiProperty({
    type: 'integer',
    default: null,
    nullable: true,
    required: false,
  })
  pageSize: number = null;
}
