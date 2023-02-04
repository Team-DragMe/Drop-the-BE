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
          const plans = await Promise.all(
            totalPlanList.map(async (plan: number) => {
              const data = await this.planRepository.findOne(plan);
              if (!data) {
                return null;
              }
              const result = {
                id: data.id,
                planDate: data.planDate,
                planName: data.planName,
                colorChip: data.colorchip,
                isCompleted: data.isCompleted,
                createdAt: data.createdAt,
              };
              return result;
            }),
          );
          return plans;
        }
        case 'reschedule': {
          const plans = await Promise.all(
            totalPlanList.map(async (plan: number) => {
              const data = await this.planRepository.findOne(plan);
              if (!data) {
                return null;
              }
              const result = {
                id: data.id,
                planDate: data.planDate,
                planName: data.planName,
                colorChip: data.colorchip,
                isCompleted: data.isCompleted,
                createdAt: data.createdAt,
              };
              return result;
            }),
          );
          return plans;
        }
        case 'routine': {
          const plans = await Promise.all(
            totalPlanList.map(async (plan: number) => {
              const data = await this.planRepository.findOne(plan);
              if (!data) {
                return null;
              }
              const result = {
                id: data.id,
                planDate: data.planDate,
                planName: data.planName,
                colorChip: data.colorchip,
                isCompleted: data.isCompleted,
                createdAt: data.createdAt,
              };
              return result;
            }),
          );
          return plans;
        }
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  public async updatePlans(
    userId: number,
    planId: number,
    planName: string,
    colorchip: string,
    planDate: string,
    isCompleted: boolean,
  ) {
    try {
      if (planName) {
        await this.planRepository.update(
          {
            id: planId,
          },
          {
            planName,
          },
        );
      }
      if (colorchip) {
        await this.planRepository.update(
          {
            id: planId,
          },
          {
            colorchip,
          },
        );
      }

      if (isCompleted) {
        await this.planRepository.update(
          {
            id: planId,
          },
          {
            isCompleted,
          },
        );
      }
      //* 우회 취소
      if (planDate) {
        //* 우회할 계획에서 계획블록 섹션으로 옮길 id 찾기
        const reschedulePlan = await this.planOrderRepository.find({
          where: {
            user_id: userId,
            type: 'reschedule',
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
            planDate,
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
            planDate,
          },
          {
            planList: dailyPlanList,
          },
        );
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
