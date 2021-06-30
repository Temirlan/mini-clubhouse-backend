import express from 'express';
import 'reflect-metadata';
import { Container } from 'inversify';
import { InversifyExpressServer, interfaces, TYPE } from 'inversify-express-utils';
import * as swagger from 'swagger-express-ts';
import cors from 'cors';

import { passport } from './core/passport';
import { API_URL } from './utils/constants';

import './db/models';
import { AuthController } from './main/auth/auth.controller';
import { UserController } from './main/user/user.controller';
import { UserDTO, SpeakerDTO } from './main/user/user.model';
import { UserService } from './main/user/user.service';
import { RoomController } from './main/room/room.controller';
import { RoomDTO } from './main/room/room.model';

const container = new Container();

container.bind<AuthController>(AuthController).toSelf();

container.bind<UserController>(UserController).toSelf();
container.bind<UserService>(UserService).toSelf();

container.bind<UserDTO>(UserDTO).toSelf();

container.bind<RoomController>(RoomController).toSelf();
container.bind<RoomDTO>(RoomDTO).toSelf();

const server = new InversifyExpressServer(container);

server.setConfig((app) => {
  app.use(passport.initialize());
  app.use(cors());
  app.use(express.json());
  app.use('/api-docs/swagger', express.static('swagger'));
  app.use('/api-docs/swagger/assets', express.static('node_modules/swagger-ui-dist'));
  app.use(
    swagger.express({
      definition: {
        externalDocs: {
          url: API_URL as string,
        },

        info: {
          title: 'Clubhouse-clone api',
          version: '1.0',
        },
        responses: {
          500: {},
        },
        securityDefinitions: {
          Bearer: {
            type: 'apiKey',
            name: 'Authorization',
            in: 'header',
          },
        },
      },
    }),
  );
});

server.setErrorConfig((app) => {
  app.use(
    (
      err: Error,
      request: express.Request,
      response: express.Response,
      next: express.NextFunction,
    ) => {
      console.error(err.stack);
      response.status(500).send('Something broke!');
    },
  );
});

const app = server.build();
app.listen(3001);
console.log('SERVER STARTED!');
