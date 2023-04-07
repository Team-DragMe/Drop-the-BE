import { PlanService } from './../services/PlanService';
import {
  BodyParam,
  Get,
  HttpCode,
  JsonController,
  Post,
  Req,
  Res,
  UseAfter,
} from 'routing-controllers';
import { CreateUserDto } from './../dtos/UserDto';
import { createRefresh, sign, verify } from './../modules/jwtHandler';
import { SocialUser } from '../dtos/SocialUser';
import { Request, Response } from 'express';
import { OpenAPI } from 'routing-controllers-openapi';
import exceptionMessage from '../modules/exceptionMessage';
import message from '../modules/responseMessage';
import statusCode from '../modules/statusCode';
import { fail, success } from '../modules/util';
import { UserService } from '../services/UserService';
import { AuthService } from '../services/AuthService';
import { env } from '../config';
import { generalErrorHandler } from '../middleware/errorHandler';

@JsonController('/auth')
export class AuthController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
    private planService: PlanService,
  ) {}

  @HttpCode(200)
  @Post('/')
  @UseAfter(generalErrorHandler)
  @OpenAPI({
    summary: '소셜 로그인 및 회원가입',
    description: '소셜 로그인 및 유저를 등록합니다.',
    statusCode: '200',
  })
  public async auth(
    @Req() req: Request,
    @Res() res: Response,
    @BodyParam('token') token: string,
    @BodyParam('provider') provider: string,
  ) {
    try {
      //* 구글 사용자 정보 가져오기
      const user = await this.authService.getSocialUser(token);

      //* 구글 user가 없다면
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
        };

        //* 회원 가입 시, 서비스에서 활용할 우회할 계획 순서배열 & 루틴로드 순서배열 생성
        await this.planService.createInitReschedulePlanOrder(newUser.id);
        await this.planService.createInitRoutineRoadPlanOrder(newUser.id);

        return res
          .status(statusCode.OK)
          .cookie('refreshToken', refreshToken, {
            domain: 'api.dragme.kr',
            path: '/',
            sameSite: 'none',
            httpOnly: env.httpOnly,
            secure: true,
          })
          .send(success(statusCode.OK, message.SIGNUP_SUCCESS, data));
      }

      //* 가입된 유저라면 로그인
      const refreshToken = createRefresh();
      await this.authService.saveRefreshToken(existUser, refreshToken);
      const accessToken = sign(existUser.id);

      const data = {
        accessToken: accessToken,
      };
      return res
        .status(statusCode.OK)
        .cookie('refreshToken', refreshToken, {
          domain: 'api.dragme.kr',
          path: '/',
          sameSite: 'none',
          httpOnly: env.httpOnly,
          secure: true,
        })
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

  @HttpCode(200)
  @Get('/token')
  @UseAfter(generalErrorHandler)
  @OpenAPI({
    summary: '토큰 재발급',
    description: 'refreshToken을 이용해서 accessToken을 재발급합니다.',
    statusCode: '200',
  })
  public async getToken(@Req() req: Request, @Res() res: Response) {
    const refreshToken = req.headers.refreshtoken;

    //* 토큰이 없다면
    if (!refreshToken)
      return res
        .status(statusCode.BAD_REQUEST)
        .send(fail(statusCode.BAD_REQUEST, message.EMPTY_TOKEN));

    try {
      const refresh = verify(refreshToken as string);
      //* 만료된 refreshToken
      if (refresh == exceptionMessage.TOKEN_EXPIRED) {
        return res
          .status(statusCode.UNAUTHORIZED)
          .send(fail(statusCode.UNAUTHORIZED, message.NULL_VALUE_TOKEN));
      }

      //* 유효하지 않은 refreshToken
      if (refresh == exceptionMessage.TOKEN_INVALID) {
        return res
          .status(statusCode.UNAUTHORIZED)
          .send(fail(statusCode.UNAUTHORIZED, message.INVALID_TOKEN));
      }

      const user = await this.authService.findUserByRfToken(
        refreshToken as string,
      );

      if (!user) {
        return res
          .status(statusCode.UNAUTHORIZED)
          .send(fail(statusCode.UNAUTHORIZED, message.INVALID_TOKEN));
      }

      const data = {
        accessToken: sign(user.id),
      };

      return res
        .status(statusCode.OK)
        .send(success(statusCode.OK, message.CREATE_TOKEN_SUCCESS, data));
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
