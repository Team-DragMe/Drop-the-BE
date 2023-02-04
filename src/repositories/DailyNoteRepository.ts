import { EntityRepository, Repository } from 'typeorm';
import { DailyNote } from '../entities/DailyNote';

@EntityRepository(DailyNote)
export class DailyNoteRepository extends Repository<DailyNote> {}
