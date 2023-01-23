import { PlanOrder } from './../entities/PlanOrder';
import { PlanOrderRepository } from './../repositories/PlanOrderRepository';
import { Service } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { PlanRepository } from '../repositories/PlanRepository';
import dayjs from 'dayjs';

@Service()
export class DailyPlanService {
  constructor(
    @InjectRepository() private planRepository: PlanRepository,
    @InjectRepository() private planOrderRepository: PlanOrderRepository,
  ) {}

  public async getPlans(userId: number, type: string, planDate: string) {
    try {
      const totalPlan = await this.planOrderRepository.find({
        where: {
          user_id: userId,
          type,
          planDate,
        },
      });

      if (totalPlan.length == 0) {
        return null;
      }

      const totalPlanList = totalPlan.pop()?.planList as number[];

      switch (type) {
        case 'daily': {
          const plans = await this.planRepository.findByIds(totalPlanList);
          return plans;
        }
        case 'reschedule': {
          const plans = await this.planRepository.findByIds(totalPlanList);
          return plans;
        }
        case 'routine': {
          const plans = await this.planRepository.findByIds(totalPlanList);
          return plans;
        }
      }
    } catch (error) {
      throw error;
    }
  }

  public async createPlan(
    userId: number,
    planName: string,
    date: Date,
    type: string,
  ) {
    try {
      switch (type) {
        case 'daily': {
          let existPlanOrder;

          //* 계획하는 날짜에 planOrder가 있는지 확인
          existPlanOrder = await this.planOrderRepository.find({
            where: {
              user_id: userId,
              type: type,
              planDate: date,
            },
          });

          if (existPlanOrder.length == 0) {
            //* planOrder가 없다면 그 날의 daily, reschedule planOrder 생성
            const dailyplanOrder = this.planOrderRepository.create({
              user_id: userId,
              type: type,
              planDate: date,
              planList: [],
            });
            existPlanOrder = [
              await this.planOrderRepository.save(dailyplanOrder),
            ];

            const reschedulePlanOrder = this.planOrderRepository.create({
              user_id: userId,
              type: 'reschedule',
              planDate: date,
              planList: [],
            });
            await this.planOrderRepository.save(reschedulePlanOrder);
          }

          //* Plan 테이블에 계획 블록 생성
          const planData = this.planRepository.create({
            planName: planName,
            planDate: date,
            user: {
              id: userId,
            },
            colorchip: 'white',
          });
          const createPlan = await this.planRepository.save(planData);

          //* planOrder에 planId 저장
          let planList = existPlanOrder.pop()?.planList as number[];
          planList.push(createPlan.id);

          //* planOrder를 DB에 업데이트
          await this.planOrderRepository.update(
            {
              user_id: userId,
              type: type,
              planDate: date,
            },
            {
              planList: planList,
            },
          );

          //* response 반환
          const data = {
            id: createPlan.id,
            planDate: dayjs(createPlan.planDate).format('YYYY-MM-DD'),
            planName: createPlan.planName,
            colorchip: createPlan.colorchip,
            planTime: createPlan.planTime,
            fulfilTime: createPlan.fulfillTime,
            type: type,
            createdAt: createPlan.createdAt,
          };
          return data;
        }
        case 'routine': {
          let existPlanOrder;

          //* 계획하는 날짜에 planOrder가 있는지 확인
          existPlanOrder = await this.planOrderRepository.find({
            where: {
              user_id: userId,
              type: type,
              planDate: date,
            },
          });
          if (existPlanOrder.length == 0) {
            //* planOrder가 없다면 그 날의 routine planOrder 생성
            const routinePlanOrder = this.planOrderRepository.create({
              user_id: userId,
              type: type,
              planDate: date,
              planList: [],
            });
            existPlanOrder = [
              await this.planOrderRepository.save(routinePlanOrder),
            ];
          }

          //* Plan 테이블에 계획 블록 생성
          const planData = await this.planRepository.create({
            planName: planName,
            planDate: date,
            user: {
              id: userId,
            },
            colorchip: 'white',
          });
          const routinePlan = await this.planRepository.save(planData);

          //* planOrder에 planId 저장
          let planList = existPlanOrder.pop()?.planList as number[];
          planList.push(routinePlan.id);

          //* planOrder를 DB에 업데이트
          await this.planOrderRepository.update(
            {
              user_id: userId,
              type: type,
              planDate: date,
            },
            {
              planList: planList,
            },
          );
          const data = {
            id: routinePlan.id,
            planDate: dayjs(routinePlan.planDate).format('YYYY-MM-DD'),
            planName: routinePlan.planName,
            colorchip: routinePlan.colorchip,
            planTime: routinePlan.planTime,
            fulfilTime: routinePlan.fulfillTime,
            type: type,
            createdAt: routinePlan.createdAt,
          };
          return data;
        }
      }
    } catch (error) {
      throw error;
    }
  }
}
