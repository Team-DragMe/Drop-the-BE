import { EntityRepository, Repository } from 'typeorm';
import { DailyPlan } from '../entities/Plan';

@EntityRepository(DailyPlan)
export class DailyPlanRepository extends Repository<DailyPlan> {}
