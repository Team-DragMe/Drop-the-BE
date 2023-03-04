import jwt from 'jsonwebtoken';
import { env } from '../config';
import exceptionMessage from './exceptionMessage';

//* 받아온 userId를 담는 accessToken 생성
export const sign = (userId: number) => {
  const payload: any = {
    user: {
      id: userId,
    },
  };

  const accesstoken = jwt.sign(payload, env.jwt.jwtSecret, {
    expiresIn: '30d',
  });
  return accesstoken;
};

//* refresh 토큰 생성
export const createRefresh = () => {
  const refreshToken = jwt.sign({}, env.jwt.jwtSecret, { expiresIn: '30d' });
  return refreshToken;
};

//* 토큰 검증
export const verify = (token: string) => {
  let decoded: string | jwt.JwtPayload;

  try {
    decoded = jwt.verify(token, env.jwt.jwtSecret);
  } catch (error: any) {
    if (error.message === 'jwt expired') {
      return exceptionMessage.TOKEN_EXPIRED;
    } else if (error.message === 'invalid token') {
      return exceptionMessage.TOKEN_INVALID;
    } else {
      return exceptionMessage.TOKEN_INVALID;
    }
  }

  return decoded;
};
