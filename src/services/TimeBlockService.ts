import { Service } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { PlanRepository } from '../repositories/PlanRepository';
import { DateTimeBlockDto, TimeBlockDto } from '../dtos/TimeBlockDto';
import { Plan } from '../entities/Plan';

@Service()
export class TimeBlockService {
  constructor(@InjectRepository() private planRepository: PlanRepository) {}

  public async fetchPlanTimeBlock(userId: number, planDate: string) {
    try {
      const plans = await this.planRepository.find({
        where: {
          planDate,
          user: {
            id: userId,
          },
        },
      });

      if (!plans) return null;

      const response = new DateTimeBlockDto();
      response.planDate = planDate;
      response.plans = this.planToDto(plans);

      return response;
    } catch (error) {
      console.log(error);

      return null;
    }
  }

  public async setTimeBlock(
    userId: number,
    planId: number,
    isPlan: boolean,
    start: number,
    end: number,
  ) {
    try {
      let timeList;
      if (start < end) {
        if (!isPlan) {
          //* 타임블록 리스트 가져오기
          const timeblockList = await this.planRepository.find({
            where: {
              user: {
                id: userId,
              },
              id: planId,
            },
          });
          const planTimeList = timeblockList.pop()?.planTime as number[];
          for (let time = start; time <= end; time++) {
            planTimeList.push(time);
          }
          timeList = Array.from(new Set(planTimeList));
          timeList.sort((time, anotherTime) => {
            return time - anotherTime;
          });
        }

        if (isPlan) {
          //* 타임블록 리스트 가져오기
          const timeblockList = await this.planRepository.find({
            where: {
              user: {
                id: userId,
              },
              id: planId,
            },
          });
          const planTimeList = timeblockList.pop()?.fulfillTime as number[];
          for (let time = start; time <= end; time++) {
            planTimeList.push(time);
          }
          timeList = Array.from(new Set(planTimeList));
          timeList.sort((time, anotherTime) => {
            return time - anotherTime;
          });
        }

        await this.planRepository.update(
          planId,
          isPlan ? { fulfillTime: timeList } : { planTime: timeList },
        );
      }

      if (end < start) {
        if (!isPlan) {
          //* 타임블록 리스트 가져오기
          const timeblockList = await this.planRepository.find({
            where: {
              user: {
                id: userId,
              },
              id: planId,
            },
          });
          let planTimeList = timeblockList.pop()?.planTime as number[];
          for (let time = end; time <= start; time++) {
            planTimeList = planTimeList.filter((index) => index !== time);
          }
          timeList = Array.from(new Set(planTimeList));
          timeList.sort((time, anotherTime) => {
            return time - anotherTime;
          });
        }

        if (isPlan) {
          //* 타임블록 리스트 가져오기
          const timeblockList = await this.planRepository.find({
            where: {
              user: {
                id: userId,
              },
              id: planId,
            },
          });
          let planTimeList = timeblockList.pop()?.fulfillTime as number[];
          for (let time = end; time <= start; time++) {
            planTimeList = planTimeList.filter((index) => index !== time);
          }
          timeList = Array.from(new Set(planTimeList));
          timeList.sort((time, anotherTime) => {
            return time - anotherTime;
          });
        }

        await this.planRepository.update(
          planId,
          isPlan ? { fulfillTime: timeList } : { planTime: timeList },
        );
      }
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
