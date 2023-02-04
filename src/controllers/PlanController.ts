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
  UseAfter,
  BodyParam,
  Body,
  Post,
} from 'routing-controllers';
import {
  errorValidator,
  getPlanValidation,
  updatePlanValidation,
} from '../middleware/errorValidator';
import { IsString } from 'class-validator';
import { PlanService } from '../services/PlanService';
import { OpenAPI } from 'routing-controllers-openapi';
import { Request, Response } from 'express';
import statusCode from '../modules/statusCode';
import message from '../modules/responseMessage';
import { success, fail } from '../modules/util';
import auth from '../middleware/auth';
import dayjs from 'dayjs';

class GetTypeAndDateQuery {
  @IsString()
  type!: string;
  planDate!: string;
}

@JsonController('/plan')
export class DailyPlanController {
  constructor(private planService: PlanService) {}

  @UseBefore(...getPlanValidation, errorValidator, auth)
  @HttpCode(200)
  @Get('/')
  @OpenAPI({
    summary: '계획 블록 조회',
    description: '일간 계획, 우회할 계획, 루틴로드 조회',
    statusCode: '200',
  })
  public async getPlans(
    @Req() req: Request,
    @Res() res: Response,
    @QueryParams() query: GetTypeAndDateQuery,
  ) {
    try {
      const userId = res.locals.JwtPayload;
      const data = await this.planService.getPlans(
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

  @UseBefore(...updatePlanValidation, errorValidator, auth)
  @HttpCode(200)
  @Patch('/:planId')
  @OpenAPI({
    summary: '계획 블록 수정',
    description: '일간 계획, 우회할 계획, 루틴로드 계획블록 수정',
    statusCode: '200',
  })
  public async updatePlans(
    @Req() req: Request,
    @Res() res: Response,
    @Param('planId') planId: string,
    @Body()
    body: {
      planName: string;
      colorchip: string;
      planDate: string;
      isCompleted: boolean;
    },
  ) {
    try {
      const userId = res.locals.JwtPayload;
      const data = await this.planService.updatePlans(
        +userId,
        +planId,
        body.planName,
        body.colorchip,
        body.planDate,
        body.isCompleted,
      );
      if (data === null) {
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

  @HttpCode(200)
  @Post('/:userId')
  @OpenAPI({
    summary: '계획 블록 조회',
    description: '일간 계획, 우회할 계획, 루틴로드 조회',
    statusCode: '200',
  })
  public async createPlan(
    @Req() req: Request,
    @Res() res: Response,
    @Param('userId') userId: string,
    @BodyParam('planName') planName: string,
    @BodyParam('date') date: string,
    @BodyParam('type') type: string,
  ) {
    if (!planName || !date || !type) {
      return res
        .status(statusCode.BAD_REQUEST)
        .send(fail(statusCode.BAD_REQUEST, message.BAD_REQUEST));
    }
    try {
      const data = await this.dailyPlanService.createPlan(
        +userId,
        planName,
        dayjs(date, 'YYYY-MM-DD').toDate(),
        type,
      );
      return res
        .status(statusCode.CREATED)
        .send(success(statusCode.CREATED, message.CREATE_PLAN_SUCCESS, data));
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
