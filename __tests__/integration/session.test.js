import request from 'supertest';
import jwt from 'jsonwebtoken';
import truncate from '../util/truncate';
import factory from '../factories';
import app from '../../src/app';

import authConfig from '../../src/config/auth';

describe('Session', () => {
  beforeEach(async () => {
    await truncate();
  });

  it('Não deve ser possível efetuar login sem ter cadastro', async () => {
    const credentials = await factory.attrs('Session');

    const response = await request(app).post('/session').send(credentials);

    expect(response.status).toBe(400);
  });

  it('Não deve ser possível efetuar login com a senha incorreta', async () => {
    const user = await factory.attrs('User');

    const createUser = await request(app).post('/users').send(user);

    const { email } = createUser.body;

    const response = await request(app).post('/session').send({
      email,
      password: '12312341',
    });

    expect(response.status).toBe(400);
  });

  it('Deve efetuar login', async () => {
    const user = await factory.attrs('User');
    const { password } = user;

    const createUser = await request(app).post('/users').send(user);

    const { email } = createUser.body;

    const response = await request(app).post('/session').send({
      email,
      password,
    });

    expect(response.status).toBe(200);
  });

  it('Deve receber um token de autenticação', async () => {
    const user = await factory.attrs('User');
    const { password } = user;

    const createUser = await request(app).post('/users').send(user);

    const { email } = createUser.body;

    const response = await request(app).post('/session').send({
      email,
      password,
    });

    expect(response.body).toHaveProperty('token');
  });
});
