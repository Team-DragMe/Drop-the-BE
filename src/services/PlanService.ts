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
}
