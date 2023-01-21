import { EntityRepository, Repository } from 'typeorm';
import { Plan } from '../entities/Plan';

@EntityRepository(Plan)
export class PlanRepository extends Repository<Plan> {}
