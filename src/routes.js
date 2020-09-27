import { Router } from 'express';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import PublicationController from './app/controllers/PublicationController';

const routes = new Router();

routes.post('/users', UserController.store);

routes.post('/session', SessionController.store);

routes.get('/publish', PublicationController.index);

export default routes;
