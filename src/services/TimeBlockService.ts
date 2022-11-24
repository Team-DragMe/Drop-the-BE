import { Service } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { DailyPlanRepository } from '../repositories/DailyPlanRepository';

@Service()
export class TimeBlockService {
  constructor(
    @InjectRepository() private dailyPlanRepository: DailyPlanRepository,
  ) {}

  public async fetchPlanTimeBlock() {
    try {
      const plans = await this.dailyPlanRepository.find();

      if (!plans) {
        return null;
      } else {
        return plans;
      }
    } catch (error) {
      console.log(error);

      return null;
    }
  }
}
