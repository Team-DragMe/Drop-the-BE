import { IsNotEmpty, Length, IsEmail, IsString } from 'class-validator';
import { User } from '../entities/User';

/**
 * 유저 생성 DTO
 */
export class CreateUserDto {
  constructor(snsId: number, nick: string, email: string, provider: string) {
    this.snsId = snsId;
    this.email = email;
    this.nick = nick;
    this.provider = provider;
  }

  @IsNotEmpty()
  public snsId: number;

  @IsNotEmpty()
  @Length(1, 50)
  @IsEmail()
  public email: string;

  @IsNotEmpty()
  @IsString()
  public nick: string;

  @IsNotEmpty()
  @IsString()
  public provider: string;
}

// export class ResponseUserDto {
//   public accessToken: string;

//   public refreshToken: string;

//   public isSignup: boolean;
// }

// export class UserDto {
//   public id: number;
//   public snsId: string;
//   public nick: string;
//   public provider: string;
//   public email: string;
//   public refreshToken: string;

//   constructor(user: User) {
//     this.id = user.id;
//     this.snsId = user.snsId;
//     this.nick = user.nick;
//     this.provider = user.provider;
//     this.email = user.email;
//   }
// }
