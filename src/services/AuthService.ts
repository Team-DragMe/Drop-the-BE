import { UserRepository } from './../repositories/UserRepository';
import { Service } from 'typedi';
import axios from 'axios';
import { env } from '../config';
import { SocialUser } from '../dtos/SocialUser';
import exceptionMessage from '../modules/exceptionMessage';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { User } from '../entities/User';
import { getConnection } from 'typeorm';

@Service()
export class AuthService {
  constructor(@InjectRepository() private userRepository: UserRepository) {}
  public async googleAuth(googleAccessToken: string) {
    try {
      //*사용자 정보 받기

      const user = await axios({
        method: 'post',
        url: `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${googleAccessToken}`,
        headers: {
          authorization: `Bearer ${googleAccessToken}`,
        },
      });
      const userId = user.data.id;
      if (!userId) return exceptionMessage.INVALID_USER;
      const name = user.data.profile.name;
      const email = user.data.email;
      const googleUser: SocialUser = {
        userId: userId,
        name: name,
        email: email,
      };

      return googleUser;
    } catch (error) {
      console.log('googleAuth error', error);
      return null;
    }
  }

  public async getSocialUser(token: string) {
    try {
      const user = await this.googleAuth(token);
      return user;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  public async saveRefreshToken(user: User, refreshToken: string) {
    const queryRunner = await getConnection().createQueryRunner();
    await queryRunner.startTransaction();

    try {
      user.refreshToken = refreshToken;
      await this.userRepository.update(
        {
          snsId: user.snsId,
        },
        {
          refreshToken: user.refreshToken,
        },
      );

      await queryRunner.commitTransaction();
    } catch (error) {
      console.log(error);
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }
}
