import request from 'supertest';
import truncate from '../util/truncate';
import factory from '../factories';
import app from '../../src/app';

describe('Session', () => {
  beforeEach(async () => {
    await truncate();
  });

  it('Não deve ser possível efetuar login sem ter cadastro', async () => {
    const credentials = await factory.attrs('Session');

    const response = await request(app).post('/session').send(credentials);

    expect(response.status).toBe(400);
  });

  // it('Verificar ')
});
