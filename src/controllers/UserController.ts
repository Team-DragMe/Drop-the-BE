import {
  Get,
  HttpCode,
  JsonController,
  Res,
  Req,
  UseBefore,
  Patch,
  Body,
  UseAfter,
} from 'routing-controllers';
import { OpenAPI } from 'routing-controllers-openapi';
import { Request, Response } from 'express';
import statusCode from '../modules/statusCode';
import message from '../modules/responseMessage';
import { success, fail } from '../modules/util';
import { UserService } from '../services/UserService';
import auth from '../middleware/auth';
import { generalErrorHandler } from './../middleware/errorHandler';
import { UpdateMyPageDto } from '../dtos/UserDto';
import { validate } from 'class-validator';

@JsonController('/user')
export class DailyNoteController {
  constructor(private userService: UserService) {}

  @HttpCode(200)
  @Get('/profile')
  @UseBefore(auth)
  @UseAfter(generalErrorHandler)
  @OpenAPI({
    summary: '마이페이지 조회',
    description: '유저의 프로필 정보를 조회합니다',
    statusCode: '200',
  })
  public async getProfileInfo(@Req() req: Request, @Res() res: Response) {
    try {
      const userId = res.locals.JwtPayload;
      const data = await this.userService.getProfileInfo(+userId);
      return res
        .status(statusCode.OK)
        .send(success(statusCode.OK, message.READ_PROFILE_SUCCESS, data));
    } catch (error) {
      throw error;
    }
  }

  @HttpCode(200)
  @Patch('/profile')
  @UseBefore(auth)
  @UseAfter(generalErrorHandler)
  @OpenAPI({
    summary: '마이페이지 수정',
    description: '마이페이지에서 유저의 닉네임 및 최종 목표를 수정합니다',
    statusCode: '200',
  })
  public async updateProfileInfo(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body: { name: string; goal: string },
  ) {
    const updateMyPageDto = new UpdateMyPageDto();
    updateMyPageDto.name = body.name;
    updateMyPageDto.goal = body.goal;

    const errors = await validate(updateMyPageDto);
    if (errors.length != 0) {
      return res
        .status(statusCode.BAD_REQUEST)
        .send(fail(statusCode.BAD_REQUEST, message.BAD_REQUEST));
    }
    try {
      const { name, goal } = updateMyPageDto;
      const userId = res.locals.JwtPayload;
      await this.userService.updateProfileInfo(+userId, name, goal);
      return res
        .status(statusCode.OK)
        .send(success(statusCode.OK, message.UPDATE_PROFILE_SUCCESS));
    } catch (error) {
      throw error;
    }
  }
}
