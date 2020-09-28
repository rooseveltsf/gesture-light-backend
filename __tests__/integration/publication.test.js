import request from 'supertest';
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
    const dataUser = await factory.attrs('User', {
      email: 'roosevelt@test.com',
      password: '12345678',
    });
    await request(app).post('/users').send(dataUser);
    const { email, password } = dataUser;

    const res = await request(app).post('/session').send({ email, password });

    const { token } = res.body;
    const response = await request(app)
      .get('/publish')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
  });
});
