import { IsNotEmpty } from 'class-validator';

export class DateTimeBlockDto {
  @IsNotEmpty()
  date?: string;
  plans?: TimeBlockDto[];
}

export class TimeBlockDto {
  @IsNotEmpty()
  planId?: number;
  planTime?: number[];
  fulfillTime?: number[];
}
