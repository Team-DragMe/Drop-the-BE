import { IsNotEmpty } from 'class-validator';

export class DateTimeBlockDto {
  @IsNotEmpty()
  planDate?: string;
  plans?: TimeBlockDto[];
}

export class TimeBlockDto {
  @IsNotEmpty()
  planId?: number;
  planTime?: number[];
  fulfillTime?: number[];
}
