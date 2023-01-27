import { Service } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { DailyNoteRepository } from '../repositories/DailyNoteRepository';

@Service()
export class DailyNoteService {
  constructor(
    @InjectRepository() private dailyNoteRepository: DailyNoteRepository,
  ) {}

  public async getDailyNote(userId: number, planDate: string) {
    try {
      const userDailyNote = await this.dailyNoteRepository.find({
        where: {
          user: {
            id: userId,
          },
          planDate,
        },
      });
      console.log(userDailyNote);

      if (!userDailyNote) {
        return null;
      } else {
        return userDailyNote;
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
