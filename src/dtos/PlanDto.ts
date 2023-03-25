import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

export class CreatePlanDto {
  @IsNotEmpty()
  @IsString()
  planName?: string;

  @IsNotEmpty()
  @IsString()
  planDate!: string;

  @IsNotEmpty()
  @IsString()
  type!: string;
}

export class MovePlanDto {
  @IsNotEmpty()
  @IsString()
  to?: string;

  @IsNotEmpty()
  @IsString()
  from?: string;

  @IsNotEmpty()
  @IsNumber()
  planId!: number;

  @IsNotEmpty()
  @IsArray()
  lastArray?: number[];
}

export class UpdatePlanDto {
  @IsString()
  planName?: string;

  @IsString()
  colorchip?: string;

  @IsBoolean()
  isCompleted?: boolean;

  @IsString()
  planDate?: string;
}
