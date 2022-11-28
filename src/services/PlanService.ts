import { PlanOrderRepository } from './../repositories/PlanOrderRepository';
import { Service } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { DailyPlanRepository } from '../repositories/DailyPlanRepository';
import { RescheduleRepository } from './../repositories/RescheduleRepository';
import { RoutineRepository } from './../repositories/RoutineRepository';

@Service()
export class DailyPlanService {
  constructor(
    @InjectRepository() private dailyPlanRepository: DailyPlanRepository,
    @InjectRepository() private rescheduleRepository: RescheduleRepository,
    @InjectRepository() private routineRepository: RoutineRepository,
    @InjectRepository() private planOrderRepository: PlanOrderRepository,
  ) {}

  public async getPlans(userId: number, type: string, planDate: string) {
    let planType: 'daily' | 'reschedule' | 'routine';
    if (type == 'daily') {
      planType = 'daily';
    } else if (type == 'reschedule') {
      planType = 'reschedule';
    } else if (type == 'routine') {
      planType = 'routine';
    }

    try {
      const totalPlan = await this.planOrderRepository.find({
        where: {
          user_id: userId,
          type,
          planDate,
        },
      });

      const totalPlanList = totalPlan.pop()?.planList as number[];

      switch (type) {
        case 'daily': {
          const plans = await this.dailyPlanRepository.findByIds(totalPlanList);
          return plans;
        }
        case 'reschedule': {
          const plans = await this.rescheduleRepository.findByIds(
            totalPlanList,
          );
          return plans;
        }
        case 'routine': {
          const plans = await this.routineRepository.findByIds(totalPlanList);
          return plans;
        }
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
