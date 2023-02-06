import {
  Get,
  HttpCode,
  JsonController,
  Res,
  Req,
  QueryParam,
  UseBefore,
  Patch,
  BodyParam,
} from 'routing-controllers';
import { OpenAPI } from 'routing-controllers-openapi';
import { Request, Response } from 'express';
import statusCode from '../modules/statusCode';
import message from '../modules/responseMessage';
import { success, fail } from '../modules/util';
import { UserService } from '../services/UserService';
import auth from '../middleware/auth';

@JsonController('/user')
export class DailyNoteController {
  constructor(private userService: UserService) {}

  @HttpCode(200)
  @Get('/profile')
  @UseBefore(auth)
  @OpenAPI({
    summary: '마이페이지 조회',
    description: '유저의 프로필 정보를 조회합니다',
    statusCode: '200',
  })
  public async getProfileInfo(@Req() req: Request, @Res() res: Response) {
    try {
      const userId = res.locals.JwtPayload;
      const data = await this.userService.getProfileInfo(+userId);
      if (!data)
        return res
          .status(statusCode.DB_ERROR)
          .send(fail(statusCode.DB_ERROR, message.NO_USER));
      return res
        .status(statusCode.OK)
        .send(success(statusCode.OK, message.READ_PROFILE_SUCCESS, data));
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
  @Patch('/profile')
  @UseBefore(auth)
  @OpenAPI({
    summary: '마이페이지 수정',
    description: '마이페이지에서 유저의 최종 목표를 수정합니다',
    statusCode: '200',
  })
  public async updateProfileInfo(
    @Req() req: Request,
    @Res() res: Response,
    @BodyParam('goal') goal: string,
  ) {
    try {
      const userId = res.locals.JwtPayload;
      await this.userService.updateProfileInfo(+userId, goal);
      return res
        .status(statusCode.OK)
        .send(success(statusCode.OK, message.READ_PROFILE_SUCCESS));
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
