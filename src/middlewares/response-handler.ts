import { Response, NextFunction } from 'express';
import { RequestExt } from '../utils/common/interfaces';
import { systemLogger } from '../utils/system-logger';

export const responseHandler = async (req: RequestExt, res: Response, next: NextFunction) => {
  res.on('finish', () => systemLogger.finishLog({ req, res }));

  next();
};
