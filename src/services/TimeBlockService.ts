import { Service } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { PlanRepository } from '../repositories/PlanRepository';

@Service()
export class TimeBlockService {
  constructor(
    @InjectRepository() private planRepository: PlanRepository,
  ) {}

  public async fetchPlanTimeBlock() {
    try {
      const plans = await this.planRepository.find();

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
