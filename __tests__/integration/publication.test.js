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

    expect(response.status).toBe(400);
  });
});
