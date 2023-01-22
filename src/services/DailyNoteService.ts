import { Service } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { DailyNoteRepository } from '../repositories/DailyNoteRepository';

@Service()
export class DailyNoteService {
  constructor(
    @InjectRepository() private dailyNoteRepository: DailyNoteRepository,
  ) {}

  public async getDailyNote(userId: number, createdAt: string) {
    try {
      const userDailyNote = await this.dailyNoteRepository.find({
        where: {
          user_id: userId,
          createdAt,
        },
      });

      if (!userDailyNote) {
        return null; // (확인해보기)널 말고 메시지 바로 보내주는게 클라가 편하려나?
      }
    } catch (error) {
      throw error;
    }
  }
}
