import request from 'supertest';
import app from '../../src/app';

import truncate from '../util/truncate';

describe('User', () => {
  beforeEach(async () => {
    await truncate();
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
});
