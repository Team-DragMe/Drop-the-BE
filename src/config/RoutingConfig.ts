export const routingControllerOptions = {
  routePrefix: '/api',
  controllers: [`${__dirname}/../controllers/*{.ts,.js}`],
  middlewares: [`${__dirname}/../middleware/*{.ts,.js}`],
  defaultErrorHandler: false,
};
