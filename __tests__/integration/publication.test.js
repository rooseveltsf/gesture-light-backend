import request from 'supertest';

import truncate from '../util/truncate';
import factory from '../factories';
import app from '../../src/app';

let token = null;
let pub_id = null;

describe('Publications', () => {
  beforeAll(async () => {
    await truncate();

    const user = await factory.create('User');

    token = user.generateToken();
  });

  afterAll(async () => {
    await truncate();
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

      pub_id = response.body.id;

      expect(response.status).toBe(200);
    });
  });

  describe('PUT /publish/:id', () => {
    it('Verifica se a publicação está sendo atualizada', async () => {
      const update = {
        title: 'Novo título',
        status: 'neutro',
      };

      const response = await request(app)
        .put(`/publish/${pub_id}`)
        .send(update)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
    });

    it('Verifica se a publicação pode ser atualizada por um usuário que não existe', async () => {
      const update = {
        title: 'Novo título',
        status: 'neutro',
      };

      const response = await request(app)
        .put(`/publish/${pub_id}`)
        .send(update)
        .set('Authorization', `Bearer 12332143`);

      expect(response.status).toBe(401);
    });

    it('Verifica se a publicação existe', async () => {
      const update = {
        title: 'Novo título',
        status: 'neutro',
      };

      const response = await request(app)
        .put(`/publish/123`)
        .send(update)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(400);
    });
  });
});
