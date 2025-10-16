import { db } from '../../../../prisma/client';
import { getUserCachedBalance, updateUserCachedBalance } from '../../../utils/redis';
import { GetBalanceDto } from '../schemas';

export const getBalance = async ({ id }: GetBalanceDto) => {
  let balance = await getUserCachedBalance(id);

  if (!balance) {
    balance = (await db.user.findFirst({ where: { id }, select: { balance: true } })).balance;

    await updateUserCachedBalance({ userId: id, balance });
  }

  return balance.toFixed(2);
};
