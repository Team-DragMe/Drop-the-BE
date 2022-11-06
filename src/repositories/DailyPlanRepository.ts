import { EntityRepository, Repository } from 'typeorm';
import { DailyPlan } from '../entities/DailyPlan';

@EntityRepository(DailyPlan)
export class DailyPlanRepository extends Repository<DailyPlan> {}
