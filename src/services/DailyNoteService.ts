import { CreateDailyNoteDto } from './../dtos/DailyNotDto';
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
      throw error;
    }
  }

  public async createDailyNote(
    userId: number,
    createDailyDto: CreateDailyNoteDto,
    type: string,
  ) {
    try {
      switch (type) {
        case 'emoji': {
          await this.dailyNoteRepository.upsert(
            [
              {
                planDate: createDailyDto.planDate,
                user: { id: userId },
                emoji: createDailyDto.content,
              },
            ],
            ['planDate'],
          );
          break;
        }
        case 'memo': {
          await this.dailyNoteRepository.upsert(
            [
              {
                planDate: createDailyDto.planDate,
                user: { id: userId },
                memo: createDailyDto.content,
              },
            ],
            ['planDate'],
          );
          break;
        }
        case 'feel':
          {
            await this.dailyNoteRepository.upsert(
              [
                {
                  planDate: createDailyDto.planDate,
                  user: { id: userId },
                  feel: createDailyDto.content,
                },
              ],
              ['planDate'],
            );
          }
          break;
      }

      const data = {
        planDate: createDailyDto.planDate,
        type,
        content: createDailyDto.content,
      };

      return data;
    } catch (error) {
      throw error;
    }
  }
}
