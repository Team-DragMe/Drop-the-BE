import { Service } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { PlanRepository } from '../repositories/PlanRepository';
import { DateTimeBlockDto, TimeBlockDto } from '../dtos/TimeBlockDto';
import { Plan } from '../entities/Plan';

@Service()
export class TimeBlockService {
  constructor(@InjectRepository() private planRepository: PlanRepository) {}

  public async fetchPlanTimeBlock(date: string) {
    try {
      const plans = await this.planRepository.find({
        where: { planDate: new Date(date).toDateString() },
      });

      if (!plans) return null;

      const response = new DateTimeBlockDto();
      response.date = date;
      response.plans = this.planToDto(plans);

      return response;
    } catch (error) {
      console.log(error);

      return null;
    }
  }

  public async setTimeBlock(
    planId: number,
    isPlan: boolean,
    timeList: number[],
  ) {
    try {
      await this.planRepository.update(
        planId,
        isPlan ? { planTime: timeList } : { fulfillTime: timeList },
      );
    } catch (error) {
      console.log(error);
    }
  }

  private planToDto(plans: Plan[]): TimeBlockDto[] {
    const timeBlockList = plans.map((plan) => {
      const timeBlock = new TimeBlockDto();

      timeBlock.planId = plan.id;
      timeBlock.planTime = plan.planTime;
      timeBlock.fulfillTime = plan.fulfillTime;

      return timeBlock;
    });

    return timeBlockList;
  }
}
