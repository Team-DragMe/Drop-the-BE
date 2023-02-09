import {
  Get,
  HttpCode,
  JsonController,
  Res,
  Req,
  QueryParam,
  UseBefore,
  Post,
  Body,
  UseAfter,
} from 'routing-controllers';
import { OpenAPI } from 'routing-controllers-openapi';
import { Request, Response } from 'express';
import statusCode from '../modules/statusCode';
import message from '../modules/responseMessage';
import { success, fail } from '../modules/util';
import { DailyNoteService } from '../services/DailyNoteService';
import auth from '../middleware/auth';
import {
  dailyNoteValidation,
  errorValidator,
} from '../middleware/errorValidator';
import { generalErrorHandler } from './../middleware/errorHandler';

@JsonController('/dailynote')
export class DailyNoteController {
  constructor(private dailyNoteService: DailyNoteService) {}

  @HttpCode(200)
  @Get('/')
  @UseBefore(...dailyNoteValidation, errorValidator, auth)
  @UseAfter(generalErrorHandler)
  @OpenAPI({
    summary: '데일리노트 조회',
    description:
      '하루를 마무리하기 위해 기록하는 데일리노트(이모지, 한 줄 소감, 메모)',
    statusCode: '200',
  })
  public async getDailyNotes(
    @Req() req: Request,
    @Res() res: Response,
    @QueryParam('planDate') planDate: string,
  ) {
    try {
      const userId = res.locals.JwtPayload;
      const data = await this.dailyNoteService.getDailyNote(+userId, planDate);
      if (!data) {
        return res
          .status(statusCode.OK)
          .send(success(statusCode.OK, message.NO_DAILYNOTE));
      }
      return res
        .status(statusCode.OK)
        .send(success(statusCode.OK, message.READ_DAILYNOTE_SUCCESS, data));
    } catch (error) {
      throw error;
    }
  }

  @HttpCode(200)
  @Post('/')
  @UseBefore(auth)
  @UseAfter(generalErrorHandler)
  @OpenAPI({
    summary: '데일리노트 생성',
    description:
      '하루를 마무리하기 위해 기록하는 데일리노트(이모지, 한 줄 소감, 메모)를 작성합니다.',
    statusCode: '201',
  })
  public async createDailyNote(
    @Req() req: Request,
    @Res() res: Response,
    @Body()
    body: {
      planDate: string;
      emoji: string;
      feel: string;
      memo: string;
    },
  ) {
    if (!body.planDate) {
      return res
        .status(statusCode.BAD_REQUEST)
        .send(fail(statusCode.BAD_REQUEST, message.BAD_REQUEST));
    }
    try {
      const userId = res.locals.JwtPayload;
      const data = await this.dailyNoteService.createDailyNote(
        +userId,
        body.planDate,
        body.emoji,
        body.feel,
        body.memo,
      );
      return res
        .status(statusCode.CREATED)
        .send(
          success(statusCode.CREATED, message.CREATE_DAILYNOTE_SUCCESS, data),
        );
    } catch (error) {
      throw error;
    }
  }
}
