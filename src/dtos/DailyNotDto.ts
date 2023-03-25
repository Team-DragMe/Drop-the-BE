import { IsNotEmpty, IsString } from 'class-validator';

export class CreateDailyNoteDto {
  @IsNotEmpty()
  @IsString()
  planDate!: string;

  @IsString()
  emoji?: string;

  @IsString()
  feel?: string;

  @IsString()
  memo?: string;
}
