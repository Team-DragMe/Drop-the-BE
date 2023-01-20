import { CreateUserDto } from './../dtos/UserDto';
import { UserRepository } from './../repositories/UserRepository';
import { Service } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { getConnection } from 'typeorm';

@Service()
export class UserService {
  constructor(@InjectRepository() private userRepository: UserRepository) {}
  public async findUserById(snsId: number) {
    try {
      const user = await this.userRepository.findOne({
        where: {
          snsId: snsId,
        },
      });
      if (!user) {
        return null;
      }
      return user;
    } catch (error) {
      throw error;
    }
  }

  public async createUser(createUserDto: CreateUserDto) {
    const queryRunner = await getConnection().createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const newUser = await this.userRepository.save(createUserDto);
      await queryRunner.commitTransaction();

      return newUser;
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }
}
