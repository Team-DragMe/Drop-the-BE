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
  public async deletePlans(
    userId: number,
    planId: number,
    type: string,
    date: string,
  ) {
    try {
      //* planOrder에 접근하여 planList 가져오기
      const totalPlan = await this.planOrderRepository.find({
        where: {
          user_id: userId,
          type,
          planDate: date,
        },
      });

      //* planList가 비어있을 경우 에러처리
      if (totalPlan.length == 0) {
        return null;
      }

      let planList = totalPlan.pop()?.planList as number[];

      //* planList에 planId에 맞는 계획이 없을 경우 에러처리
      const checkPlanList = planList.includes(planId);

      if (!checkPlanList) {
        return null;
      }
      //* planList에서 planId 제거
      let updatePlanList = planList.filter((plan) => plan !== planId);

      //* planId가 제거된 배열을 DB에 저장
      await this.planOrderRepository.update(
        {
          user_id: userId,
          type,
          planDate: date,
        },
        {
          planList: updatePlanList,
        },
      );

      //* 마지막으로 plan table에서 계획블록 삭제
      const data = await this.planRepository.delete({
        id: planId,
      });
      return data;
    } catch (error) {
      throw error;
    }
  }
}
