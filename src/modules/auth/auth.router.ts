import express, { Response } from 'express';
import { errorHandler, responseHandler, validate } from '../../middlewares';
import { RequestExt } from '../../utils/common/interfaces';

import * as AuthSchemas from './schemas';
import * as AuthServices from './services';

const router = express.Router();

router.post('/register', async (req: RequestExt, res: Response, next: any) => {
  try {
    const { login, password } = validate(AuthSchemas.registerSchema, req.body);
    const result = await AuthServices.register({ login, password });

    res.send(result);
    next();
  } catch (error) {
    errorHandler({
      message: `Ошибка регистрации`,
      error,
      req,
      res,
    });
  }
});

router.post('/login', async (req: RequestExt, res: Response, next: any) => {
  try {
    const { login, password } = validate(AuthSchemas.loginSchema, req.body);
    const result = await AuthServices.login({ login, password });

    res.send(result);
    next();
  } catch (error) {
    errorHandler({
      message: `Ошибка логина`,
      error,
      req,
      res,
    });
  }
});

router.use(responseHandler);

export { router };
