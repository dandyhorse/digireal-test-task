import { Response, NextFunction } from 'express';
import { RequestExt } from '../utils/common/interfaces';

export const setRequestStartTime = async (req: RequestExt, res: Response, next: NextFunction) => {
  req.startTime = Date.now();
  next();
};
