import {
  Get,
  HttpCode,
  JsonController,
  Res,
  Req,
  Param,
  QueryParams,
  UseBefore,
  Patch,
  BodyParam,
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
  date!: string;
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
        query.date,
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
  @Patch('/:userId/:planId')
  @UseBefore(errorValidator)
  @OpenAPI({
    summary: '계획 블록 수정',
    description: '일간 계획, 우회할 계획, 루틴로드 계획블록 수정',
    statusCode: '200',
  })
  public async updatePlans(
    @Req() req: Request,
    @Res() res: Response,
    @Param('userId') userId: string,
    @Param('planId') planId: string,
    @BodyParam('planName') planName: string,
    @BodyParam('colorChip') colorChip: string,
  ) {
    try {
      const data = await this.dailyPlanService.updatePlans(
        +userId,
        +planId,
        planName,
        colorChip,
      );
      if (!data) {
        return res
          .status(statusCode.BAD_REQUEST)
          .send(fail(statusCode.BAD_REQUEST, message.UPDATE_PLAN_FAIL));
      }
      return res
        .status(statusCode.OK)
        .send(success(statusCode.OK, message.UPDATE_PLAN_SUCCESS));
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
