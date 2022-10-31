import jwt from 'jsonwebtoken';
import { env } from '../config';

const getToken = (userId: any): string => {
  const payload: any = {
    user: {
      id: userId,
    },
  };
  const accesstoken = jwt.sign(payload, env.jwt.jwtSecret, {
    expiresIn: '2h',
  });
  return accesstoken;
};

export default { getToken };
