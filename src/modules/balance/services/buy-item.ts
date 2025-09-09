import { BalanceHistoryActionType } from '../../../../generated/client';
import { db } from '../../../../prisma/client';
import { updateUserCachedBalance } from '../../../utils/redis';
import { BuyItemDto } from '../schemas/buy-item.schema';

export const buyItem = async ({ userId, itemId }: BuyItemDto & { userId: number }) => {
  return await db.$transaction(async (tx) => {
    const item = await tx.item.findUnique({
      where: { id: itemId },
    });

    if (!item || item.ownerId !== null) throw { details: 'Предмет недоступен' };

    const user = await tx.user.findUnique({
      where: { id: userId },
    });

    if (user.balance < item.price) throw { details: 'Недостаточно средств' };

    const { balance } = await tx.user.update({
      where: { id: userId },
      data: {
        balance: {
          decrement: item.price,
        },
      },
      select: { balance: true },
    });

    await tx.balanceHistory.create({
      data: {
        userId,
        action: BalanceHistoryActionType.WITHDRAW,
        amount: item.price,
      },
    });

    await tx.item.update({
      where: { id: itemId },
      data: {
        ownerId: userId,
      },
    });

    await updateUserCachedBalance({ userId, balance });

    return {
      success: true,
      message: 'Успешно куплен предмет',
    };
  });
};
