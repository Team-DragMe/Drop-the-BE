import { EntityRepository, Repository } from 'typeorm';
import { Reschedule } from './../entities/Reschedule';

@EntityRepository(Reschedule)
export class RescheduleRepository extends Repository<Reschedule> {}
