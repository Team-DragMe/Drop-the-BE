import { UserRepository } from './../repositories/UserRepository';
import { Service } from 'typedi';
import axios from 'axios';
import { SocialUser } from '../dtos/SocialUser';
import exceptionMessage from '../modules/exceptionMessage';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { User } from '../entities/User';

@Service()
export class AuthService {
  constructor(@InjectRepository() private userRepository: UserRepository) {}
  public async googleAuth(googleAccessToken: string) {
    try {
      //*사용자 정보 받기

      const user = await axios({
        method: 'get',
        url: `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${googleAccessToken}`,
        headers: {
          authorization: `Bearer ${googleAccessToken}`,
        },
      });
      const userId = user.data.id;
      if (!userId) return exceptionMessage.INVALID_USER;
      const name = user.data.name;
      const email = user.data.email;
      const profile = user.data.picture;
      const googleUser: SocialUser = {
        userId: userId,
        name: name,
        email: email,
        profile: profile,
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
      console.log();
      return user;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  public async saveRefreshToken(user: User, refreshToken: string) {
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
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  public async findUserByRfToken(refreshToken: string) {
    try {
      const user = await this.userRepository.findOne({
        where: {
          refreshToken: refreshToken,
        },
      });
      if (!user) {
        return null;
      }
      return user;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
