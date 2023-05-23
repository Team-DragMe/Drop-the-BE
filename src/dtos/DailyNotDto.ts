import { Type } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateDailyNoteDto {
  @IsNotEmpty()
  @IsString()
  planDate!: string;

  @IsNotEmpty()
  @IsString()
  content?: string;
}
