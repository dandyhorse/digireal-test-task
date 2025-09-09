import { db } from '../../../../prisma/client';

export const getAllBalances = async () => db.user.findMany({ select: { id: true, balance: true } });
