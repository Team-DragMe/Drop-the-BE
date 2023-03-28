import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class CreateDailyNoteDto {
  @IsNotEmpty()
  @IsString()
  @Matches(/^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/)
  planDate!: string;

  @IsString()
  emoji?: string;

  @IsString()
  feel?: string;

  @IsString()
  memo?: string;
}
