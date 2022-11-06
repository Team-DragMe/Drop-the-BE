import express, { Request, Response, NextFunction } from 'express';
const app = express();
import connectDB from './loaders/db';
import { routingControllerOptions } from './config/RoutingConfig';
import { useContainer, useExpressServer } from 'routing-controllers';
import Container from 'typedi';
import bodyParser from 'body-parser';

require('dotenv').config();

connectDB();

interface ErrorType {
  message: string;
  status: number;
}

// Middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: false }));

app.use(function (
  err: ErrorType,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'production' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// Routing
try {
  useContainer(Container);
  useExpressServer(app, routingControllerOptions);
} catch (error) {
  console.log(error);
}

app
  .listen(process.env.PORT, () => {
    console.log(`
    ################################################
          🛡️  Server listening on port 🛡️
    ################################################
  `);
  })
  .on('error', (err) => {
    console.error(err);
    process.exit(1);
  });
