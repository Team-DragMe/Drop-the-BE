import { Service } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { DailyNoteRepository } from '../repositories/DailyNoteRepository';

@Service()
export class DailyNoteService {
  constructor(
    @InjectRepository() private dailyNoteRepository: DailyNoteRepository,
  ) {}
}
