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

export const deletePlanValidation = [
  param('planId').notEmpty(),
  query('type').notEmpty().isIn(['daily', 'routine', 'reschedule']),
  query('planDate')
    .notEmpty()
    .matches(/^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/),
];

export const movePlanValidation = [query('planDate').notEmpty()];

export const dailyNoteValidation = [
  query('planDate')
    .notEmpty()
    .matches(/^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/),
];

export const calendarValidation = [
  query('month')
    .notEmpty()
    .matches(/^\d{4}-(0[1-9]|1[012])$/),
];

export const getTimeBlockValidation = [
  query('planDate')
    .notEmpty()
    .matches(/^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/),
];

export const setTimeBlockValidation = [param('planId').notEmpty()];
