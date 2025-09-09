import request from 'supertest';
import { app } from '../src/app';

import { Decimal } from '@prisma/client/runtime/library';
import { db } from '../prisma/client';

describe('API Tests:', () => {
  let userZeroLogin: string = 'user_zero@mail.com';
  let userOneLogin: string = 'user_one@mail.com';
  let userZeroId: number;
  let userOneId: number;
  let userZeroToken: string;
  let userOneToken: string;
  let itemId: string;

  beforeAll(async () => {
    await db.item.createMany({
      data: [
        {
          description: 'Item worth 10',
          price: new Decimal(10),
        },
        {
          description: 'Item worth 50',
          price: new Decimal(50),
        },
        {
          description: 'Item worth 100',
          price: new Decimal(100),
        },
      ],
    });

    const items = await db.item.findMany({ where: { price: new Decimal(50), ownerId: null } });

    itemId = items[0].id;
  });

  it('should register, login and update balance for userZero successfully', async () => {
    const registerResponse = await request(app)
      .post('/auth/register')
      .send({ login: userZeroLogin, password: 'pass' });

    expect(registerResponse.status).toBe(200);
    expect(registerResponse.body).toHaveProperty('token');
    expect(registerResponse.body).toHaveProperty('id');

    const loginResponse = await request(app)
      .post('/auth/login')
      .send({ login: userZeroLogin, password: 'pass' });

    expect(loginResponse.status).toBe(200);
    expect(loginResponse.body).toHaveProperty('token');
    expect(loginResponse.body).toHaveProperty('id');

    userZeroId = loginResponse.body.id;
    userZeroToken = loginResponse.body.token;

    await db.user.update({
      where: { id: userZeroId },
      data: { balance: new Decimal(50) },
    });
  });

  it('should register, login and update balance for userOne successfully', async () => {
    const registerResponse = await request(app)
      .post('/auth/register')
      .send({ login: userOneLogin, password: 'pass' });

    expect(registerResponse.status).toBe(200);
    expect(registerResponse.body).toHaveProperty('token');
    expect(registerResponse.body).toHaveProperty('id');

    const loginResponse = await request(app)
      .post('/auth/login')
      .send({ login: userOneLogin, password: 'pass' });

    expect(loginResponse.status).toBe(200);
    expect(loginResponse.body).toHaveProperty('token');
    expect(loginResponse.body).toHaveProperty('id');

    userOneId = loginResponse.body.id;
    userOneToken = loginResponse.body.token;

    await db.user.update({
      where: { id: userOneId },
      data: { balance: new Decimal(50) },
    });
  });

  it('should buy item successfully for userZero (200)', async () => {
    const response = await request(app)
      .post('/balance/buy-item')
      .send({ jwt: userZeroToken, itemId });

    expect(response.status).toBe(200);
  });

  it('shouldnt buy item successfully for userOne (500)', async () => {
    const response = await request(app)
      .post('/balance/buy-item')
      .send({ jwt: userOneToken, itemId });

    expect(response.status).toBe(500);
  });

  afterAll(async () => {
    // С продовой базой такой лучше не проворачивать ...
    // Сделано сугубо для проверки логики на тестовом проекте

    await db.balanceHistory.deleteMany();
    await Promise.all([db.user.deleteMany(), db.item.deleteMany()]);
  });
});
