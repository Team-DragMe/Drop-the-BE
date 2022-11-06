import {
  Get,
  Header,
  HeaderParams,
  HttpCode,
  JsonController,
  Res,
  Req,
} from 'routing-controllers';
import { DailyPlanService } from '../services/DailyPlanService';
import { OpenAPI } from 'routing-controllers-openapi';
import { Response } from 'express';
import statusCode from '../modules/statusCode';
import message from '../modules/responseMessage';
import util from '../modules/util';

@JsonController('/daily')
export class DailyPlanController {
  constructor(private dailyPlanService: DailyPlanService) {}

  @HttpCode(200)
  @Get('')
  @OpenAPI({
    summary: '임시 데이터 조회',
    description: 'API 테스트 및 DI 테스트용',
    statusCode: '200',
  })
  public async fetchData(@Res() res: Response): Promise<Response> {
    try {
      const list = await this.dailyPlanService.fetchDailyPlan();

      return res
        .status(statusCode.OK)
        .send(
          util.success(statusCode.OK, message.FETCH_DAILY_PLAN_SUCCESS, list),
        );
    } catch (error) {
      return res
        .status(statusCode.INTERNAL_SERVER_ERROR)
        .send(
          util.fail(
            statusCode.INTERNAL_SERVER_ERROR,
            message.INTERNAL_SERVER_ERROR,
          ),
        );
    }
  }
}
