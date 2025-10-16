import express, { Response } from 'express';
import { errorHandler, responseHandler, validate } from '../../middlewares';
import { RequestExt } from '../../utils/common/interfaces';
import { jwtAuth } from '../../middlewares/jwt-auth';

import * as BalanceSchemas from './schemas';
import * as BalanceServices from './services';
import { buyItemSchema } from './schemas/buy-item.schema';

const router = express.Router();

// Если честно, здесь я нарушаю все разумные границы с точки зрения договорённостей REST API:
// для любых (GET / POST / PUT / DELETE) запросов, в домашних или тестовых проектах, я предпочитаю делать просто POST,
// т.к. это унифицирует подход и не требует, например, отдельного валидатора параметров для GET запросов,
// а так же позволяет держать JWT не в заголовке, а в теле запроса, что позволяет нам держать в контексте больше ~8КБ,

router.use(jwtAuth);

router.post('/', async (req: RequestExt, res: Response, next: any) => {
  try {
    const balance = await BalanceServices.getBalance({ id: req.user.id });

    res.send(balance);
    next();
  } catch (error) {
    console.log(error);
    errorHandler({
      message: `Ошибка получения баланса`,
      error,
      req,
      res,
    });
  }
});

router.post('/buy-item', async (req: RequestExt, res: Response, next: any) => {
  try {
    const { itemId } = validate(buyItemSchema, req.body);

    const result = await BalanceServices.buyItem({ userId: req.user.id, itemId });

    res.send(result);
    next();
  } catch (error) {
    errorHandler({
      message: `Ошибка покупки предмета`,
      error,
      req,
      res,
    });
  }
});

// TODO: Дальше мне просто стало жалко времени, я чет и так перебрал, кажется, для тестового,
// но вообще по-хорошему должны быть вот эти роутинги:

// router.post('/deposit', async (req: RequestExt, res: Response, next: any) => {
//   try {
//     const { amount } = validate(depositSchema, req.body);

//     const result = await BalanceServices.deposit({ userId: req.user.id, amount });

//     res.send(result);
//     next();
//   } catch (error) {
//     errorHandler({
//       message: `Ошибка пополнения баланса`,
//       error,
//       req,
//       res,
//     });
//   }
// });

// router.post('/history', async (req: RequestExt, res: Response, next: any) => {
//   try {
//     res.send(200);
//     next();
//   } catch (error) {
//     errorHandler({
//       message: `Ошибка получения истории баланса`,
//       error,
//       req,
//       res,
//     });
//   }
// });

// router.post('/items', async (req: RequestExt, res: Response, next: any) => {
//   try {
//     res.send(200);
//     next();
//   } catch (error) {
//     errorHandler({
//       message: `Ошибка получения купленных предметов`,
//       error,
//       req,
//       res,
//     });
//   }
// });

router.use(responseHandler);

export { router };
