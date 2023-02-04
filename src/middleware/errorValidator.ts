import { Request, Response, NextFunction } from 'express';
import { body, check, query } from 'express-validator';
import message from '../modules/responseMessage';
import statusCode from '../modules/statusCode';
import { fail } from '../modules/util';
const { validationResult } = require('express-validator');

const errorValidator = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(statusCode.BAD_REQUEST)
      .send(fail(statusCode.BAD_REQUEST, message.BAD_REQUEST));
  }
  next();
};

const getPlanValidation = [
  query('type').notEmpty().isIn(['daily', 'routine', 'reschedule']),
  query('planDate').notEmpty(),
];

const updatePlanValidation = [
  check('planName').if(body('planName').exists()).notEmpty(),
  check('colorchip').if(body('colorchip').exists()).notEmpty(),
  check('planDate').if(body('planDate').exists()).notEmpty(),
  check('isCompleted').if(body('isCompleted').exists()).notEmpty(),
];
export { errorValidator, getPlanValidation, updatePlanValidation };
