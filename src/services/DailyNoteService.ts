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
      const userDailyNote = await this.dailyNoteRepository.findOne({
        where: {
          user: {
            id: userId,
          },
          planDate,
        },
      });

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

  public async createDailyNote(
    userId: number,
    planDate: string,
    emoji: string,
    feel: string,
    memo: string,
  ) {
    try {
      const dailyNote = await this.dailyNoteRepository.create({
        planDate,
        emoji,
        feel,
        memo,
        user: {
          id: userId,
        },
      });
      await this.dailyNoteRepository.insert(dailyNote);

      const data = {
        planDate: dailyNote.planDate,
        emoji: dailyNote.emoji,
        feel: dailyNote.feel,
        memo: dailyNote.memo,
      };
      return data;
    } catch (error) {
      throw error;
    }
  }
}
