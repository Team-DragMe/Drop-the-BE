import {
  IsArray,
  IsBoolean,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsString,
  Matches,
} from 'class-validator';

export class CreatePlanDto {
  @IsNotEmpty()
  @IsString()
  planName?: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/)
  planDate!: string;

  @IsNotEmpty()
  @IsString()
  @IsIn(['daily', 'routine', 'reschedule'])
  type!: string;
}

export class MovePlanDto {
  @IsNotEmpty()
  @IsString()
  @IsIn(['daily', 'routine', 'reschedule'])
  to?: string;

  @IsNotEmpty()
  @IsString()
  @IsIn(['daily', 'routine', 'reschedule'])
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
  @Matches(/^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/)
  planDate?: string;
}
