import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import PublicationController from './app/controllers/PublicationController';
import authMiddleware from './app/middlewares/auth';

const routes = new Router();

const upload = multer(multerConfig);

routes.post('/users', UserController.store);

routes.post('/session', SessionController.store);

routes.use(authMiddleware);

routes.get('/publish', PublicationController.index);
routes.post('/publish', upload.single('file'), PublicationController.store);
routes.put('/publish/:id', PublicationController.update);
routes.put('/publish/:id', PublicationController.update);
routes.delete('/publish/:id', PublicationController.delete);

export default routes;
