import { EntityRepository, Repository } from 'typeorm';
import { PlanOrder } from './../entities/PlanOrder';

@EntityRepository(PlanOrder)
export class PlanOrderRepository extends Repository<PlanOrder> {}
