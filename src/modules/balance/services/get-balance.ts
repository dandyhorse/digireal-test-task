import { db } from '../../../../prisma/client';
import { GetBalanceDto } from '../schemas';

export const getBalance = async ({ id }: GetBalanceDto) => {
  // TODO: redis caching

  const balance = await db.user.findFirst({ where: { id }, select: { balance: true } });

  return balance;
};
