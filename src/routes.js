import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import PublicationController from './app/controllers/PublicationController';
import NotificationController from './app/controllers/NotificationController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();

const upload = multer(multerConfig);

routes.post('/users', UserController.store);

routes.post('/session', SessionController.store);

routes.use(authMiddleware);

routes.put('/avatar', upload.single('file'), UserController.update);

routes.get('/publish', PublicationController.index);
routes.post('/publish', upload.single('file'), PublicationController.store);
routes.put('/publish/:id', PublicationController.update);
routes.delete('/publish/:id', PublicationController.delete);

routes.get('/notifications', NotificationController.index);
routes.post('/notifications/:publication_id', NotificationController.store);
routes.put('/notifications/:id', NotificationController.update);

export default routes;
