const { Router } = require('express');
const multer = require('multer');
const multerConfig = require('./config/multer');

const UserController = require('./app/controllers/UserController');
const SessionController = require('./app/controllers/SessionController');
const PublicationController = require('./app/controllers/PublicationController');
const NotificationController = require('./app/controllers/NotificationController');

const authMiddleware = require('./app/middlewares/auth');

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

module.exports = routes;
