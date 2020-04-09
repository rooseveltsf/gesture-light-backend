import request from 'supertest';
import bcrypt from 'bcryptjs';

import app from '../../src/app';
import User from '../../src/app/models/User';

import truncate from '../util/truncate';

describe('User', () => {
  beforeEach(async () => {
    await truncate();
  });

  it('deve ser possivel cryptografar a senha informada no cadastro', async () => {
    const user = await User.create({
      name: 'Roosevelt de Souza',
      endereco: 'Praia de acaú',
      email: 'roosevelt@mail.com',
      password: 'llruy007',
    });

    const compareHash = await bcrypt.compare('llruy007', user.password_hash);
    expect(compareHash).toBe(true);
  });

  it('deve ser possivel se cadastrar', async () => {
    const response = await request(app).post('/users').send({
      name: 'Roosevelt de Souza',
      endereco: 'Praia de acaú',
      email: 'roosevelt@mail.com',
      password: 'llruy007',
    });

    expect(response.body).toHaveProperty('name');
  });

  it('não deve ser possivel se cadastrar com email duplicado', async () => {
    await request(app).post('/users').send({
      name: 'Roosevelt de Souza',
      endereco: 'Praia de acaú',
      email: 'roosevelt@mail.com',
      password: 'llruy007',
    });

    const response = await request(app).post('/users').send({
      name: 'Roosevelt de Souza',
      endereco: 'Praia de acaú',
      email: 'roosevelt@mail.com',
      password: 'llruy007',
    });

    expect(response.status).toBe(400);
  });

  it('não deve ser possivel se cadastrar faltando informações', async () => {
    const response = await request(app).post('/users').send({
      name: '',
      endereco: 'Praia de acaú',
      email: 'roosevelt@mail.com',
      password: 'llruy007',
    });

    expect(response.status).toBe(400);
  });
});
