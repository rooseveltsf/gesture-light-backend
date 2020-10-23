import './bootstrap';
import Youch from 'youch';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path';
import 'express-async-errors';
import io from 'socket.io';
import http from 'http';

import routes from './routes';

import './database';

class App {
  constructor() {
    this.app = express();
    this.server = http.Server(this.app);

    this.socket();

    this.middlewares();
    this.routes();
    this.exceptionHandler();

    this.connectedUsers = {};
  }

  socket() {
    this.io = io(this.server);

    this.io.on('connection', (socket) => {
      const { user_id } = socket.handshake.query;
      this.connectedUsers[user_id] = socket.id;

      socket.on('disconnect', () => {
        delete this.connectedUsers[user_id];
      });
    });
  }

  middlewares() {
    this.app.use(bodyParser.json({ limit: '50mb', extended: true }));
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(cors());
    this.app.use(
      '/publish',
      express.static(path.resolve(__dirname, '..', 'tmp', 'uploads'))
    );
    this.app.use(
      '/avatar',
      express.static(path.resolve(__dirname, '..', 'tmp', 'uploads'))
    );

    this.app.use((req, res, next) => {
      req.io = this.io;
      req.connectedUsers = this.connectedUsers;

      next();
    });
  }

  routes() {
    this.app.use(routes);
  }

  exceptionHandler() {
    this.app.use(async (err, req, res) => {
      if (process.env.NODE_ENV === 'development') {
        const errors = await new Youch(err, req).toJSON();

        return res.status(500).json(errors);
      }

      return res.status(500).json({ error: 'Internal server error' });
    });
  }
}

export default new App().server;
