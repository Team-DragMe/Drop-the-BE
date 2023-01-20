import { CreateUserDto } from './../dtos/UserDto';
import { createRefresh, sign } from './../modules/jwtHandler';
import { SocialUser } from '../dtos/SocialUser';
import { Request, Response } from 'express';
import {
  HttpCode,
  JsonController,
  Post,
  Req,
  Res,
  UseBefore,
} from 'routing-controllers';
import { OpenAPI } from 'routing-controllers-openapi';
import errorValidator from '../middleware/errorValidator';
import exceptionMessage from '../modules/exceptionMessage';
import message from '../modules/responseMessage';
import statusCode from '../modules/statusCode';
import { fail, success } from '../modules/util';
import { UserService } from '../services/UserService';
import { AuthService } from '../services/AuthService';

@JsonController('/auth')
export class AuthController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
  ) {}

  @HttpCode(200)
  @Post('/')
  @UseBefore(errorValidator)
  @OpenAPI({
    summary: '소셜 로그인 및 회원가입',
    description: '소셜 로그인 및 유저를 등록합니다.',
    statusCode: '200',
  })
  public async auth(@Req() req: Request, @Res() res: Response) {
    const { token, provider } = req.body;

    try {
      //* 구글 사용자 정보 가져오기
      const user = await this.authService.getSocialUser(token);

      //* user가 없다면
      if (!user) {
        return res
          .status(statusCode.UNAUTHORIZED)
          .send(fail(statusCode.UNAUTHORIZED, message.INVALID_TOKEN));
      }
      if (user == exceptionMessage.INVALID_USER) {
        return res
          .status(statusCode.UNAUTHORIZED)
          .send(fail(statusCode.UNAUTHORIZED, message.NO_USER));
      }
      const createUserDto = new CreateUserDto(
        (user as SocialUser).userId,
        (user as SocialUser).name,
        (user as SocialUser).email,
        provider,
      );
      //* 서비스에 가입된 유저인지 확인
      const existUser = await this.userService.findUserById(
        createUserDto.snsId,
      );

      if (!existUser) {
        //* 가입되지 않은 유저일 경우 회원가입
        const refreshToken = createRefresh();
        const newUser = await this.userService.createUser(createUserDto);
        if (!newUser) {
          return res
            .status(statusCode.DB_ERROR)
            .send(fail(statusCode.DB_ERROR, message.CREATE_USER_FAIL));
        }
        await this.authService.saveRefreshToken(newUser, refreshToken);

        const accessToken = sign(newUser.id);
        const data = {
          user: {
            id: newUser.id,
            email: newUser.email,
            nick: newUser.nick,
            provider: newUser.provider,
          },
          accessToken: accessToken,
          refreshToken: refreshToken,
        };
        return res
          .status(statusCode.OK)
          .send(success(statusCode.OK, message.SIGNUP_SUCCESS, data));
      }

      //* 가입된 유저라면 로그인
      const refreshToken = createRefresh();
      await this.authService.saveRefreshToken(existUser, refreshToken);
      const accessToken = sign(existUser.id);

      const data = {
        accessToken: accessToken,
        refreshToken: refreshToken,
      };
      return res
        .status(statusCode.OK)
        .send(success(statusCode.OK, message.SIGNIN_SUCCESS, data));
    } catch (error) {
      console.log(error);
      return res
        .status(statusCode.INTERNAL_SERVER_ERROR)
        .send(
          fail(statusCode.INTERNAL_SERVER_ERROR, message.INTERNAL_SERVER_ERROR),
        );
    }
  }
}
