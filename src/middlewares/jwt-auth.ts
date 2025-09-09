import { Response, NextFunction } from 'express';
import { RequestExt } from '../utils/common/interfaces';
import { systemLogger } from '../utils';
import jwt from 'jsonwebtoken';
import { jwtSecret } from '../utils/config';
import { errorHandler } from './error-handler';

export const jwtAuth = async (req: RequestExt, res: Response, next: NextFunction) => {
  try {
    const token = req.body.jwt;

    const { user } = jwt.verify(token, jwtSecret) as { user: { id: number } };

    req.user = user;

    next();
  } catch (error) {
    errorHandler({
      message: `Not authenticated`,
      error: { type: 'auth' },
      req,
      res,
    });
  }
};
