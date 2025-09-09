import { createClient } from 'redis';
import { systemLogger } from './system-logger';
import { LogLevel } from './common/logger-dtos';
import * as BalanceModule from '../modules/balance';
import { RedisKeys } from './common/consts';
import { Decimal } from '@prisma/client/runtime/library';

const redisClient = createClient().on('error', (error: Error) =>
  systemLogger.log({
    level: LogLevel.ERROR,
    module: 'redis',
    message: 'Redis Client error',
    details: error,
  }),
);

(async () => {
  await redisClient.connect();
})();

export const cacheAllBalances = async () => {
  const userBalances = await BalanceModule.BalanceServices.getAllBalances();

  const promises: Promise<any>[] = [];

  for (const { id, balance } of userBalances) {
    promises.push(redisClient.set(`${RedisKeys.USER_BALANCE}:${id}`, balance.toFixed(2)));
  }

  await Promise.all(promises);

  systemLogger.log({
    level: LogLevel.INFO,
    module: 'redis',
    message: `Cache warmed up: user balances loaded into RAM`,
  });
};

export const updateUserCachedBalance = async ({
  userId,
  balance,
}: {
  userId: number;
  balance: Decimal;
}) => {
  const key = `${RedisKeys.USER_BALANCE}:${userId}`;
  await redisClient.set(key, balance.toFixed(2));

  systemLogger.log({
    level: LogLevel.INFO,
    module: 'redis',
    message: `User balance updated in cache: ${userId} = ${balance.toFixed(2)}`,
  });
};

export const getUserCachedBalance = async (userId: number): Promise<Decimal | null> => {
  const key = `${RedisKeys.USER_BALANCE}:${userId}`;
  const balanceStr = await redisClient.get(key);

  if (!balanceStr) {
    return null;
  }

  return new Decimal(balanceStr as string);
};
