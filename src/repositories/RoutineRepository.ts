import { EntityRepository, Repository } from 'typeorm';
import { RoutineRoad } from './../entities/RoutineRoad';

@EntityRepository(RoutineRoad)
export class RoutineRepository extends Repository<RoutineRoad> {}
