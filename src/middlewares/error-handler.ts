import { z } from 'zod';
import { Response } from 'express';
import { RequestExt } from '../utils/common/interfaces';
import { systemLogger } from '../utils/system-logger';

export interface ErrorHandlerDto {
  message: string;
  error: any;
  req: RequestExt;
  res: Response;
}

export const errorHandler = async ({ message, error, req, res }: ErrorHandlerDto) => {
  let statusCode: number;

  switch (true) {
    case error.type === z.ZodError:
      statusCode = 400;
      break;
    case error.type === 'auth':
      statusCode = 403;
      break;
    default:
      statusCode = 500;
      break;
  }

  res.statusCode = statusCode;
  error = { ...error, message, type: undefined };

  systemLogger.finishLog({ req, res, error });

  // res.status(statusCode).json({ message, validationIssues: error.validationIssues });
  res.status(statusCode).json(error);
};
