import './bootstrap';
import Youch from 'youch';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path';
import 'express-async-errors';

import routes from './routes';

import './database';

class App {
  constructor() {
    this.server = express();

    this.middlewares();
    this.routes();
    this.exceptionHandler();
  }

  middlewares() {
    // this.server.use((req, res, next) => {
    //   res.header('Access-Control-Allow-Origin', '*');
    //   res.header(
    //     'Access-Control-Allow-Headers',
    //     'x-www-form-urlencoded, Origin, X-Requested-With, Content-Type, Accept, Authorization, *'
    //   );
    //   if (req.method === 'OPTIONS') {
    //     res.header(
    //       'Access-Control-Allow-Methods',
    //       'GET, PUT, POST, PATCH, DELETE, OPTIONS'
    //     );
    //     res.setHeader('Access-Control-Allow-Credentials', true);
    //     return res.status(200).json({});
    //   }
    //   next();
    // });
    this.server.use(bodyParser.json({ limit: '50mb', extended: true }));
    this.server.use(bodyParser.urlencoded({ extended: true }));
    this.server.use(cors());
    this.server.use(
      '/publish',
      express.static(path.resolve(__dirname, '..', 'tmp', 'uploads'))
    );
    this.server.use(
      '/avatar',
      express.static(path.resolve(__dirname, '..', 'tmp', 'uploads'))
    );
  }

  routes() {
    this.server.use(routes);
  }

  exceptionHandler() {
    this.server.use(async (err, req, res) => {
      if (process.env.NODE_ENV === 'development') {
        const errors = await new Youch(err, req).toJSON();
        console.log(errors);

        return res.status(500).json(errors);
      }

      return res.status(500).json({ error: 'Internal server error' });
    });
  }
}

export default new App().server;
