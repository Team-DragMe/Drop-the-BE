import { PlanOrderRepository } from './../repositories/PlanOrderRepository';
import { Service } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { PlanRepository } from '../repositories/PlanRepository';

@Service()
export class PlanService {
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
    date: string,
  ) {
    try {
      if (planName) {
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
      if (colorChip) {
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
      //* 우회 취소
      if (date) {
        //* 우회할 계획에서 계획블록 섹션으로 옮길 id 찾기
        const reschedulePlan = await this.planOrderRepository.find({
          where: {
            user_id: userId,
            type: 'reschedule',
            planDate: date,
          },
        });

        if (reschedulePlan.length == 0) {
          return null;
        }
        let planList = reschedulePlan.pop()?.planList as number[];

        //* planList에 planId에 맞는 계획이 없을 경우 에러처리
        const checkPlanList = planList.includes(planId);

        if (!checkPlanList) {
          return null;
        }
        //* 우회할 planList에서 planId 제거
        const reschedulePlanList = planList.filter((plan) => plan !== planId);

        await this.planOrderRepository.update(
          {
            user_id: userId,
            type: 'reschedule',
            planDate: date,
          },
          {
            planList: reschedulePlanList,
          },
        );

        //* 계획 블록 planList 찾아내기
        const dailyPlan = await this.planOrderRepository.find({
          where: {
            user_id: userId,
            type: 'daily',
            planDate: date,
          },
        });

        if (dailyPlan.length == 0) {
          return null;
        }
        let dailyPlanList = dailyPlan.pop()?.planList as number[];
        //* 계획 블록 섹션에 추가
        dailyPlanList.push(planId);

        await this.planOrderRepository.update(
          {
            user_id: userId,
            type: 'daily',
            planDate: date,
          },
          {
            planList: dailyPlanList,
          },
        );
      }
    } catch (error) {
      console.log(error);
    }
  }
}
