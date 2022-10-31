export const routingControllerOptions = {
  cors: {
    credentials: true,
    origin: ['http://localhost:8080'],
  },
  routePrefix: 'api',
  controllers: [`${__dirname}/../controllers/*{.ts,.js}`],
  middlewares: [`${__dirname}/../middlewares/*{.ts,.js}`],
};
