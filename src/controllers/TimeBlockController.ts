import {
  Body,
  Get,
  HttpCode,
  JsonController,
  Param,
  Post,
  QueryParam,
  Res,
  UseAfter,
  UseBefore,
} from 'routing-controllers';
import { OpenAPI } from 'routing-controllers-openapi';
import { TimeBlockService } from '../services/TimeBlockService';
import { Response } from 'express';
import statusCode from '../modules/statusCode';
import { success, fail } from '../modules/util';
import message from '../modules/responseMessage';
import auth from '../middleware/auth';
import {
  getTimeBlockValidation,
  errorValidator,
  setTimeBlockValidation,
} from '../middleware/errorValidator';
import { generalErrorHandler } from './../middleware/errorHandler';

@JsonController('/timeblock')
export class TimeBlockController {
  constructor(private timeBlockService: TimeBlockService) {}

  @HttpCode(200)
  @Post('/:planId')
  @UseBefore(auth, ...setTimeBlockValidation, errorValidator)
  @UseAfter(generalErrorHandler)
  @OpenAPI({
    summary: '타임블록 설정',
    description: '해당 유저, 해당 날짜의 타임블록 설정',
    statusCode: '200',
  })
  public async setData(
    @Res() res: Response,
    @Param('planId') planId: number,
    @Body() body: { isPlan: boolean; start: number; end: number },
  ): Promise<Response> {
    if (body.isPlan == undefined || !body.start || !body.end) {
      return res
        .status(statusCode.BAD_REQUEST)
        .send(fail(statusCode.BAD_REQUEST, message.BAD_REQUEST));
    }
    try {
      const userId = res.locals.JwtPayload;
      await this.timeBlockService.setTimeBlock(
        userId,
        planId,
        body.isPlan,
        body.start,
        body.end,
      );
      return res
        .status(statusCode.OK)
        .send(success(statusCode.OK, message.UPDATE_TIMEBLOCK_SUCCESS));
    } catch (error) {
      throw error;
    }
  }
}
