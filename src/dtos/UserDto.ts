import { IsNotEmpty, Length, IsEmail, IsString } from 'class-validator';

/**
 * 유저 생성 DTO
 */
export class CreateUserDto {
  constructor(
    snsId: string,
    nick: string,
    email: string,
    profile: string,
    provider: string,
  ) {
    this.snsId = snsId;
    this.email = email;
    this.nick = nick;
    this.profile = profile;
    this.provider = provider;
  }

  @IsNotEmpty()
  public snsId: string;

  @IsNotEmpty()
  @Length(1, 50)
  @IsEmail()
  public email: string;

  @IsNotEmpty()
  @IsString()
  public nick: string;

  @IsNotEmpty()
  @IsString()
  public profile: string;

  @IsNotEmpty()
  @IsString()
  public provider: string;
}

export class UpdateMyPageDto {
  name?: string;
  goal?: string;
}
