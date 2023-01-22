import {
  Get,
  HttpCode,
  JsonController,
  Res,
  Req,
  Param,
  QueryParams,
} from 'routing-controllers';
import { IsString } from 'class-validator';
import { OpenAPI } from 'routing-controllers-openapi';
import { Request, Response } from 'express';
import statusCode from '../modules/statusCode';
import message from '../modules/responseMessage';
import { success, fail } from '../modules/util';
import { DailyNoteService } from '../services/DailyNoteService';

class GetTypeAndDateQuery {
  @IsString()
  createdAt!: string;
}

@JsonController('/dailynote')
export class DailyNoteController {
  constructor(private dailyNoteService: DailyNoteService) {}

  @HttpCode(200)
  @Get('/:userId')
  @OpenAPI({
    summary: '데일리노트 조회',
    description:
      '하루를 마무리하기 위해 기록하는 데일리노트(이모지, 한 줄 소감, 메모)',
    statusCode: '200',
  })
  public async getDailyNotes(
    @Req() req: Request,
    @Res() res: Response,
    @Param('userId') userId: string,
    @QueryParams() query: GetTypeAndDateQuery,
  ) {
    try {
      const data = await this.dailyNoteService.getDailyNote(
        +userId,
        query.createdAt,
      );
      return res
        .status(statusCode.OK)
        .send(success(statusCode.OK, message.READ_DAILYNOTE_SUCCESS, data));
    } catch (error) {
      console.log(error);
      return res
        .status(statusCode.INTERNAL_SERVER_ERROR)
        .send(
          fail(statusCode.INTERNAL_SERVER_ERROR, message.INTERNAL_SERVER_ERROR),
        );
    }
  }
}
