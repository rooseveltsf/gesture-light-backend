import request from 'supertest';
import app from '../../src/app';

describe('User', () => {
  it('deve ser possivel se cadastrar', async () => {
    const response = await request(app).post('/users').send({
      name: 'Roosevelt de Souza',
      endereco: 'Praia de acaú',
      email: 'roosevelt@mail.com',
      password: 'llruy007',
    });

    expect(response.body).toHaveProperty('name');
  });
});
