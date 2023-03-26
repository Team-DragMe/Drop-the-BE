import { IsBoolean, IsNotEmpty, IsNumber } from 'class-validator';

export class TimeBlockDto {
  @IsNotEmpty()
  @IsBoolean()
  isPlan!: boolean;

  @IsNotEmpty()
  @IsNumber()
  start!: number;

  @IsNotEmpty()
  @IsNumber()
  end!: number;
}
