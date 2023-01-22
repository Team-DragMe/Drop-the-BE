import {
  Get,
  Header,
  HeaderParams,
  HttpCode,
  JsonController,
  Res,
  Req,
  Param,
  QueryParams,
  UseBefore,
  UseAfter,
} from 'routing-controllers';
import errorValidator from '../middleware/errorValidator';
import { IsString } from 'class-validator';
import { OpenAPI } from 'routing-controllers-openapi';
import { Request, Response } from 'express';
import statusCode from '../modules/statusCode';
import message from '../modules/responseMessage';
import { success, fail } from '../modules/util';
import { DailyNoteService } from '../services/DailyNoteService';

@JsonController('/dailynote')
export class DailyNoteController {
  constructor(private dailyNoteService: DailyNoteService) {}
}
