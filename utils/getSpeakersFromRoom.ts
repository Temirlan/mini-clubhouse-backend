import { Socket } from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import { UserInstance } from '../db/models/user';

export type SocketRoom = Record<
  string,
  {
    roomId: string;
    user: Omit<UserInstance, 'token'>;
    socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap>;
  }
>;

export const getSpeakersFromRoom = (rooms: SocketRoom, roomId: string) => {
  return Object.values(rooms)
    .filter((r) => r.roomId === roomId)
    .map((r) => r.user);
};
