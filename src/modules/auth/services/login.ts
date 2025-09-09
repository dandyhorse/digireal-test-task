import jwt from 'jsonwebtoken';
import { db } from '../../../../prisma/client';
import { jwtSecret } from '../../../utils/config';
import { LoginDto } from '../schemas';

export const login = async ({ login, password }: LoginDto) => {
  const user = await db.user.findFirstOrThrow({ where: { login, password }, select: { id: true } });
  const token = jwt.sign({ user: { id: user.id } }, jwtSecret);

  return { token, id: user.id };
};
