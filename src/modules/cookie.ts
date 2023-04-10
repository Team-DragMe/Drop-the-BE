import cookie, { CookieSerializeOptions } from 'cookie';
import { env } from '../config';

const cookieOptions: CookieSerializeOptions = {
  httpOnly: env.httpOnly,
  secure: true,
  sameSite: 'none',
  path: '/',
};

const setRefreshTokenCookie = (refreshToken: string) => {
  return cookie.serialize('refreshToken', refreshToken, cookieOptions);
};
export default {
  setRefreshTokenCookie,
};
