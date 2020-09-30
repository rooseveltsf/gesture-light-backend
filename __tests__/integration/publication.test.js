import request from 'supertest';

import truncate from '../util/truncate';
import factory from '../factories';
import app from '../../src/app';

let token = null;

describe('Publications', () => {
  beforeEach(async () => {
    await truncate();

    const user = await factory.create('User');

    token = user.generateToken();
  });

  describe('GET /publish', () => {
    it('Verifica se usuário existe antes da listagem de publicação', async () => {
      const response = await request(app).get('/publish');

      expect(response.status).toBe(401);
    });

    it('Verifica se está listando as publicações', async () => {
      const response = await request(app)
        .get('/publish')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
    });
  });

  describe('POST /publish', () => {
    it('Verifica se a publicação é feita', async () => {
      const {
        title,
        description,
        address,
        status,
        latitude,
        longitude,
      } = await factory.attrs('Publication');

      const dir = `${__dirname}/../util/test.jpg`;

      const response = await request(app)
        .post('/publish')
        .field('title', title)
        .field('description', description)
        .field('status', status)
        .field('address', address)
        .field('latitude', latitude)
        .field('longitude', longitude)
        .attach('file', dir)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
    });
  });
});
