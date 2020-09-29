import request from 'supertest';
import jwt from 'jsonwebtoken';

import authConfig from '../../src/config/auth';
import truncate from '../util/truncate';
import factory from '../factories';
import app from '../../src/app';

describe('Publications', () => {
  beforeEach(async () => {
    await truncate();
  });

  it('Verifica se usuário existe antes da listagem de publicação', async () => {
    const response = await request(app).get('/publish');

    expect(response.status).toBe(401);
  });

  it('Verifica se está listando as publicações', async () => {
    const { id } = await factory.create('User', {
      email: 'roosevelt@test.com',
      password: '12345678',
    });

    const token = jwt.sign({ id }, authConfig.secret);

    const response = await request(app)
      .get('/publish')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
  });
});
