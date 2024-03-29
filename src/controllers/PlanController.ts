import { CreatePlanDto, MovePlanDto, UpdatePlanDto } from './../dtos/PlanDto';
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
  Body,
  Post,
  Delete,
  QueryParam,
  UseAfter,
} from 'routing-controllers';
import {
  calendarValidation,
  deletePlanValidation,
  errorValidator,
  getPlanValidation,
  movePlanValidation,
} from '../middleware/errorValidator';
import { IsString, validate } from 'class-validator';
import { PlanService } from '../services/PlanService';
import { OpenAPI } from 'routing-controllers-openapi';
import { Request, Response } from 'express';
import statusCode from '../modules/statusCode';
import message from '../modules/responseMessage';
import { success, fail } from '../modules/util';
import auth from '../middleware/auth';
import { generalErrorHandler } from '../middleware/errorHandler';

class GetTypeAndDateQuery {
  @IsString()
  type!: string;
  planDate!: string;
}

@JsonController('/plan')
export class DailyPlanController {
  constructor(private planService: PlanService) {}

  @HttpCode(200)
  @Get('/')
  @UseBefore(...getPlanValidation, errorValidator, auth)
  @UseAfter(generalErrorHandler)
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

  @HttpCode(200)
  @Patch('/:planId')
  @UseBefore(auth)
  @UseAfter(generalErrorHandler)
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
    const updatePlanDto = new UpdatePlanDto();
    updatePlanDto.planName = body.planName;
    updatePlanDto.colorchip = body.colorchip;
    updatePlanDto.planDate = body.planDate;
    updatePlanDto.isCompleted = body.isCompleted;

    const errors = await validate(updatePlanDto);
    if (errors.length != 0) {
      return res
        .status(statusCode.BAD_REQUEST)
        .send(fail(statusCode.BAD_REQUEST, message.BAD_REQUEST));
    }
    try {
      const { planName, colorchip, planDate, isCompleted } = updatePlanDto;
      const userId = res.locals.JwtPayload;
      await this.planService.updatePlans(
        +userId,
        +planId,
        planName,
        colorchip,
        planDate,
        isCompleted,
      );
      return res
        .status(statusCode.OK)
        .send(success(statusCode.OK, message.UPDATE_PLAN_SUCCESS));
    } catch (error) {
      throw error;
    }
  }

  @HttpCode(201)
  @Post('/')
  @UseBefore(auth)
  @UseAfter(generalErrorHandler)
  @OpenAPI({
    summary: '계획 블록 생성',
    description: '일간 계획, 우회할 계획, 루틴로드 생성',
    statusCode: '201',
  })
  public async createPlan(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body: { planName: string; planDate: string; type: string },
  ) {
    const createPlanDto = new CreatePlanDto();
    createPlanDto.planName = body.planName;
    createPlanDto.planDate = body.planDate;
    createPlanDto.type = body.type;

    const errors = await validate(createPlanDto);
    if (errors.length != 0) {
      return res
        .status(statusCode.BAD_REQUEST)
        .send(fail(statusCode.BAD_REQUEST, message.BAD_REQUEST));
    }
    try {
      const { planName, planDate, type } = createPlanDto;
      const userId = res.locals.JwtPayload;
      const data = await this.planService.createPlan(
        userId,
        planName,
        planDate,
        type,
      );
      return res
        .status(statusCode.CREATED)
        .send(success(statusCode.CREATED, message.CREATE_PLAN_SUCCESS, data));
    } catch (error) {
      throw error;
    }
  }

  @HttpCode(200)
  @Delete('/:planId')
  @UseBefore(...deletePlanValidation, errorValidator, auth)
  @UseAfter(generalErrorHandler)
  @OpenAPI({
    summary: '계획 블록 삭제',
    description: '일간 계획, 우회할 계획, 루틴로드 계획블록 삭제',
    statusCode: '200',
  })
  public async deletePlans(
    @Req() req: Request,
    @Res() res: Response,
    @Param('planId') planId: string,
    @QueryParams() query: GetTypeAndDateQuery,
  ) {
    try {
      const userId = res.locals.JwtPayload;
      await this.planService.deletePlans(
        +userId,
        +planId,
        query.type,
        query.planDate,
      );
      return res
        .status(statusCode.OK)
        .send(success(statusCode.OK, message.DELETE_PLAN_SUCCESS));
    } catch (error) {
      throw error;
    }
  }

  @HttpCode(200)
  @Patch('/')
  @UseBefore(...movePlanValidation, errorValidator, auth)
  @UseAfter(generalErrorHandler)
  @OpenAPI({
    summary: '계획 블록 순서 이동 및 변경',
    description: '계획 블록 순서 이동 및 변경합니다.',
    statusCode: '200',
  })
  public async moveAndChangePlanOrder(
    @Req() req: Request,
    @Res() res: Response,
    @QueryParam('planDate') planDate: string,
    @Body()
    body: { to: string; from: string; planId: number; lastArray: number[] },
  ) {
    const movePlanDto = new MovePlanDto();
    movePlanDto.to = body.to;
    movePlanDto.from = body.from;
    movePlanDto.planId = body.planId;
    movePlanDto.lastArray = body.lastArray;

    const errors = await validate(movePlanDto);
    if (errors.length != 0) {
      return res
        .status(statusCode.BAD_REQUEST)
        .send(fail(statusCode.BAD_REQUEST, message.BAD_REQUEST));
    }
    try {
      const { to, from, planId, lastArray } = movePlanDto;
      const userId = res.locals.JwtPayload;
      await this.planService.moveAndChangePlanOrder(
        +userId,
        to,
        from,
        planId,
        lastArray,
        planDate,
      );
      return res
        .status(statusCode.OK)
        .send(success(statusCode.OK, message.MOVE_PLAN_ORDER_SUCCESS));
    } catch (error) {
      throw error;
    }
  }

  @HttpCode(200)
  @Get('/calendar')
  @UseBefore(...calendarValidation, errorValidator, auth)
  @UseAfter(generalErrorHandler)
  @OpenAPI({
    summary: '날짜별 계획블록 존재여부 조회',
    description: '날짜별 계획블록 존재여부를 조회합니다.',
    statusCode: '200',
  })
  public async getCalendarPlan(
    @Req() req: Request,
    @Res() res: Response,
    @QueryParam('month') month: string,
  ) {
    try {
      const userId = res.locals.JwtPayload;
      const data = await this.planService.getCalendarPlan(+userId, month);

      return res
        .status(statusCode.OK)
        .send(success(statusCode.OK, message.READ_CALENDAR_PLAN_SUCCESS, data));
    } catch (error) {
      throw error;
    }
  }
}
