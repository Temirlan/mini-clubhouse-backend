import { Server as SocketServer } from 'socket.io';
import { getSpeakersFromRoom, SocketRoom } from '../utils/getSpeakersFromRoom';
import Room from '../db/models/room';
import { Server } from 'http';

export const socketRoomsController = (instance: Server) => {
  const io = new SocketServer(instance, {
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
};
