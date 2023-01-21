import { PlanOrderRepository } from './../repositories/PlanOrderRepository';
import { Service } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { PlanRepository } from '../repositories/PlanRepository';

@Service()
export class DailyPlanService {
  constructor(
    @InjectRepository() private planRepository: PlanRepository,
    @InjectRepository() private planOrderRepository: PlanOrderRepository,
  ) {}

  public async getPlans(userId: number, type: string, date: string) {
    try {
      const totalPlan = await this.planOrderRepository.find({
        where: {
          user_id: userId,
          type,
          planDate: date,
        },
      });

      if (totalPlan.length == 0) {
        return null;
      }

      const totalPlanList = totalPlan.pop()?.planList as number[];
      switch (type) {
        case 'daily': {
          const plans = await Promise.all(
            totalPlanList.map((plan: number) => {
              const result = this.planRepository.findOne(plan);
              return result;
            }),
          );
          return plans;
        }
        case 'reschedule': {
          const plans = await Promise.all(
            totalPlanList.map((plan: number) => {
              const result = this.planRepository.findOne(plan);
              return result;
            }),
          );
          return plans;
        }
        case 'routine': {
          const plans = await Promise.all(
            totalPlanList.map((plan: number) => {
              const result = this.planRepository.findOne(plan);
              return result;
            }),
          );
          return plans;
        }
      }
    } catch (error) {
      throw error;
    }
  }
  public async updatePlans(
    userId: number,
    planId: number,
    planName: string,
    colorChip: string,
  ) {
    try {
      //* 계획 이름만 수정하는 경우
      if (planName && !colorChip) {
        await this.planRepository.update(
          {
            id: planId,
            user: {
              id: userId,
            },
          },
          {
            planName: planName,
          },
        );
      }
      //* 컬러칩만 수정하는 경우
      if (!planName && colorChip) {
        await this.planRepository.update(
          {
            id: planId,
            user: {
              id: userId,
            },
          },
          {
            colorchip: colorChip,
          },
        );
      }
      //* 계획 이름, 컬러칩 모두 수정하는 경우
      if (planName && colorChip) {
        await this.planRepository.update(
          {
            id: planId,
            user: {
              id: userId,
            },
          },
          {
            planName: planName,
            colorchip: colorChip,
          },
        );
      }
      return null;
    } catch (error) {
      console.log(error);
    }
  }
}
