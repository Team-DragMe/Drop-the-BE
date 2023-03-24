import { IsNotEmpty, IsString } from 'class-validator';

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
