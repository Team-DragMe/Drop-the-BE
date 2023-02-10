import { NextFunction, Request, Response } from 'express';
import {
  ExpressErrorMiddlewareInterface,
  Middleware,
} from 'routing-controllers';
import responseMessage from '../modules/responseMessage';
import { slackMessage } from '../modules/returnToSlackMessage';
import { sendMessageToSlack } from '../modules/slack';
import { fail } from '../modules/util';
import { ErrorWithStatusCode } from './errorGenerator';
import { env } from '../config';

@Middleware({ type: 'after' })
export class generalErrorHandler implements ExpressErrorMiddlewareInterface {
  error(
    error: ErrorWithStatusCode,
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    const { message, statusCode } = error;
    if (!statusCode || statusCode == 500) {
      if (env.env === 'production') {
        const errorMessage: string = slackMessage(
          req.method.toUpperCase(),
          req.originalUrl,
          error.stack,
          res.locals.JwtPayload,
        );
        sendMessageToSlack(errorMessage);
      }
      return res
        .status(500)
        .send(fail(500, responseMessage.INTERNAL_SERVER_ERROR));
    } else {
      return res.status(statusCode).send(fail(statusCode, message));
    }
  }
}
