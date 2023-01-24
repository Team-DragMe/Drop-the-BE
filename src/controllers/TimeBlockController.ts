import { Get, HttpCode, JsonController, Param, Res } from 'routing-controllers';
import { OpenAPI } from 'routing-controllers-openapi';

import { TimeBlockService } from '../services/TimeBlockService';
import { Response } from 'express';
import statusCode from '../modules/statusCode';
import { success, fail } from '../modules/util';
import message from '../modules/responseMessage';

@JsonController('/timeblock')
export class TimeBlockController {
  constructor(private timeBlockService: TimeBlockService) {}

  @HttpCode(200)
  @Get('/:date')
  @OpenAPI({
    summary: '타임블록 조회',
    description: '해당 유저, 해당 날짜의 타임블록 조회',
    statusCode: '200',
  })
  public async fetchData(
    @Res() res: Response,
    @Param('date') date: string,
  ): Promise<Response> {
    try {
      const list = await this.timeBlockService.fetchPlanTimeBlock(date);
      return res
        .status(statusCode.OK)
        .send(success(statusCode.OK, message.FETCH_TIMEBLOCK_SUCCESS, list));
    } catch (error) {
      return res
        .status(statusCode.INTERNAL_SERVER_ERROR)
        .send(
          fail(statusCode.INTERNAL_SERVER_ERROR, message.INTERNAL_SERVER_ERROR),
        );
    }
  }
}
