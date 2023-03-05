import { Service } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';
import message from '../modules/responseMessage';
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
      await this.dailyNoteRepository.upsert(
        [
          {
            planDate: planDate,
            user: { id: userId },
            emoji: emoji,
            feel: feel,
            memo: memo,
          },
        ],
        ['planDate'],
      );

      const data = {
        planDate: planDate,
        emoji: emoji,
        feel: feel,
        memo: memo,
      };

      return data;
    } catch (error) {
      throw error;
    }
  }
}
