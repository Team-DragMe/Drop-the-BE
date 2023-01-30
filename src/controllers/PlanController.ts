import {
  Get,
  Header,
  HeaderParams,
  HttpCode,
  JsonController,
  Res,
  Req,
  Param,
  QueryParams,
  UseBefore,
  UseAfter,
  Body,
  Patch,
  QueryParam,
} from 'routing-controllers';
import errorValidator from '../middleware/errorValidator';
import { IsString } from 'class-validator';
import { DailyPlanService } from '../services/PlanService';
import { OpenAPI } from 'routing-controllers-openapi';
import { Request, Response } from 'express';
import statusCode from '../modules/statusCode';
import message from '../modules/responseMessage';
import { success, fail } from '../modules/util';

class GetTypeAndDateQuery {
  @IsString()
  type!: string;
  planDate!: string;
}

@JsonController('/plan')
export class DailyPlanController {
  constructor(private dailyPlanService: DailyPlanService) {}

  @HttpCode(200)
  @Get('/:userId')
  @OpenAPI({
    summary: '계획 블록 조회',
    description: '일간 계획, 우회할 계획, 루틴로드 조회',
    statusCode: '200',
  })
  public async getPlans(
    @Req() req: Request,
    @Res() res: Response,
    @Param('userId') userId: string,
    @QueryParams() query: GetTypeAndDateQuery,
  ) {
    try {
      const data = await this.dailyPlanService.getPlans(
        +userId,
        query.type,
        query.planDate,
      );
      return res
        .status(statusCode.OK)
        .send(success(statusCode.OK, message.READ_PLAN_SUCCESS, data));
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
  @Patch('/:userId')
  @OpenAPI({
    summary: '계획 블록 순서 이동 및 변경',
    description: '계획 블록 순서 이동 및 변경합니다.',
    statusCode: '200',
  })
  public async moveAndChangePlanOrder(
    @Req() req: Request,
    @Res() res: Response,
    @Param('userId') userId: string,
    @QueryParam('planDate') planDate: string,
    @Body()
    body: {
      to: string;
      from: string;
      planId: number;
      lastArray: number[];
    },
  ) {
    try {
      const data = await this.dailyPlanService.moveAndChangePlanOrder(
        +userId,
        body.to,
        body.from,
        body.planId,
        body.lastArray,
        planDate,
      );
      return res
        .status(statusCode.OK)
        .send(success(statusCode.OK, message.MOVE_PLAN_ORDER_SUCCESS));
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
