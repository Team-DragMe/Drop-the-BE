import { Request, Response, NextFunction } from 'express';
import { body, check, param, query } from 'express-validator';
import message from '../modules/responseMessage';
import statusCode from '../modules/statusCode';
import { fail } from '../modules/util';
const { validationResult } = require('express-validator');

export const errorValidator = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(statusCode.BAD_REQUEST)
      .send(fail(statusCode.BAD_REQUEST, message.BAD_REQUEST));
  }
  next();
};

export const getPlanValidation = [
  query('type').notEmpty().isIn(['daily', 'routine', 'reschedule']),
  query('planDate').notEmpty(),
];

// export const updatePlanValidation = [
//   check('planName').if(body('planName').exists()).notEmpty(),
//   check('colorchip').if(body('colorchip').exists()).notEmpty(),
//   check('planDate').if(body('planDate').exists()).notEmpty(),
//   check('isCompleted').if(body('isCompleted').exists()).notEmpty(),
// ];

// export const createPlanValidation = [
//   body('planName').notEmpty(),
//   body('planDate').notEmpty(),
//   body('type').notEmpty(),
// ];

export const deletePlanValidation = [
  param('planId').notEmpty(),
  query('type').notEmpty().isIn(['daily', 'routine', 'reschedule']),
  query('planDate').notEmpty(),
];

export const movePlanValidation = [query('planDate').notEmpty()];

export const dailyNoteValidation = [query('planDate').notEmpty()];

export const calendarValidation = [
  query('month')
    .notEmpty()
    .matches(/^\d{4}-(0[1-9]|1[012])$/),
];

export const getTimeBlockValidation = [query('planDate').notEmpty()];

export const setTimeBlockValidation = [param('planId').notEmpty()];
