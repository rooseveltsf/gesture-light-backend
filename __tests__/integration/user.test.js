import request from 'supertest';
import bcrypt from 'bcryptjs';

import app from '../../src/app';
// import User from '../../src/app/models/User';
import factory from '../factories';

import truncate from '../util/truncate';

describe('User', () => {
  beforeEach(async () => {
    await truncate();
  });

  it('deve ser possivel cryptografar a senha informada no cadastro', async () => {
    const user = await factory.create('User', {
      password: 'llruy007',
    });

    const compareHash = await bcrypt.compare('llruy007', user.password_hash);
    expect(compareHash).toBe(true);
  });

  it('deve ser possivel se cadastrar', async () => {
    const user = await factory.attrs('User');

    const response = await request(app).post('/users').send(user);

    expect(response.body).toHaveProperty('name');
  });

  it('não deve ser possivel se cadastrar com email duplicado', async () => {
    const user = await factory.attrs('User');

    await request(app).post('/users').send(user);

    const response = await request(app).post('/users').send(user);

    expect(response.status).toBe(400);
  });

  it('não deve ser possivel se cadastrar faltando informações', async () => {
    const user = await factory.attrs('User', { name: '' });
    const response = await request(app).post('/users').send(user);

    expect(response.status).toBe(400);
  });
});
