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
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  },
  routePrefix: '/api',
  controllers: [`${__dirname}/../controllers/*{.ts,.js}`],
  middlewares: [`${__dirname}/../middleware/*{.ts,.js}`],
  defaultErrorHandler: false,
};
