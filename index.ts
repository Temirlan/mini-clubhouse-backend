import express from 'express';
import 'reflect-metadata';
import { Container } from 'inversify';
import { InversifyExpressServer } from 'inversify-express-utils';
import * as swagger from 'swagger-express-ts';
import cors from 'cors';
import { Server } from 'socket.io';

import { passport } from './core/passport';
import { API_URL } from './utils/constants';

import './db/models';
import { AuthController } from './main/auth/auth.controller';
import { UserController } from './main/user/user.controller';
import { UserDTO } from './main/user/user.model';
import { UserService } from './main/user/user.service';
import { RoomController } from './main/room/room.controller';
import { RoomDTO } from './main/room/room.model';
import { getSpeakersFromRoom, SocketRoom } from './utils/getSpeakersFromRoom';
import Room from './db/models/room';

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

const instance = app.listen(3001);

console.log('SERVER STARTED!');

const io = new Server(instance, {
  cors: {
    origin: '*',
  },
});

const rooms: SocketRoom = {};

io.on('connection', (socket) => {
  console.log('connection', socket.id);

  socket.on('client join to room', ({ user, roomId }) => {
    socket.join(`room/${roomId}`);
    rooms[socket.id] = { user, roomId, socket };

    socket.to(`room/${roomId}`).emit('init connection receiver', socket.id);

    const speakers = getSpeakersFromRoom(rooms, roomId);
    io.in(`room/${roomId}`).emit('speakers', speakers);
    io.emit('rooms', {
      speakers,
      roomId: +roomId,
    });

    Room.update({ speakers }, { where: { id: +roomId } });
  });

  socket.on('create initiator peer', (socketId) => {
    rooms[socketId].socket.emit('init connection sender', socket.id);
  });

  socket.on('signal', ({ socketId, signal }) => {
    if (!rooms[socketId]) return;

    rooms[socketId].socket.emit('signal', {
      socketId: socket.id,
      signal,
    });
  });

  socket.on('disconnecting', () => {
    if (rooms[socket.id]) {
      const { user, roomId } = rooms[socket.id];

      socket.broadcast.to(`room/${roomId}`).emit('user leave to room', {
        socketId: socket.id,
        userId: user.id,
      });

      delete rooms[socket.id];

      const speakers = getSpeakersFromRoom(rooms, roomId);
      io.emit('rooms', {
        speakers,
        roomId: +roomId,
      });
      Room.update({ speakers }, { where: { id: +roomId } });
    }
  });
});
