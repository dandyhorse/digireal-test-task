import jwt from 'jsonwebtoken';
import { db } from '../../../../prisma/client';
import { RegisterDto } from '../schemas';
import { jwtSecret } from '../../../utils/config';

export const register = async ({ login, password }: RegisterDto) => {
  const alreadyExistedUser = await db.user.findFirst({ where: { login, password } });

  if (alreadyExistedUser) throw { details: 'User already exists' };

  const user = await db.user.create({ data: { login, password }, select: { id: true } });
  const token = jwt.sign({ user: { id: user.id } }, jwtSecret);

  return { token, id: user.id };
};
