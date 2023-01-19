import { Request, Response, NextFunction } from 'express';
import message from '../modules/responseMessage';
import statusCode from '../modules/statusCode';
import { fail } from '../modules/util';
const { validationResult } = require('express-validator');

const errorValidator = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(statusCode.BAD_REQUEST)
      .send(fail(statusCode.BAD_REQUEST, message.NULL_VALUE));
  }
  next();
};

export default errorValidator;
