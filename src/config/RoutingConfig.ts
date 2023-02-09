import { env } from '.';

export const routingControllerOptions = {
  cors: {
    credentials: true,
    origin: [
      `${env.ec2URL}`,
      `${env.baseURL}`,
      'http://localhost:3000',
      'https://dragme.kr',
      'https://www.dragme.kr',
    ],
  },
  routePrefix: '/api',
  controllers: [`${__dirname}/../controllers/*{.ts,.js}`],
  middlewares: [`${__dirname}/../middleware/*{.ts,.js}`],
  defaultErrorHandler: false,
};
