import { UserInstance } from '../db/models/user';

export type SocketRoom = Record<
  string,
  {
    roomId: string;
    user: Omit<UserInstance, 'token'>;
  }
>;

export const getSpeakersFromRoom = (rooms: SocketRoom, roomId: string) => {
  return Object.values(rooms)
    .filter((r) => r.roomId === roomId)
    .map((r) => r.user);
};
