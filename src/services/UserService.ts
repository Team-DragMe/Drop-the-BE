import { CreateUserDto } from './../dtos/UserDto';
import { UserRepository } from './../repositories/UserRepository';
import { Service } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';

@Service()
export class UserService {
  constructor(@InjectRepository() private userRepository: UserRepository) {}
  public async findUserById(snsId: string) {
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
    try {
      const createUser = this.userRepository.create({
        email: createUserDto.email,
        nick: createUserDto.nick,
        provider: createUserDto.provider,
        snsId: createUserDto.snsId,
      });
      const newUser = await this.userRepository.save(createUser);
      return newUser;
    } catch (error) {
      throw error;
    }
  }
}
