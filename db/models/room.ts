import { Table, Model, Column, DataType } from 'sequelize-typescript';
import { UserInstance } from './user';

export enum RoomType {
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
  SOCIAL = 'SOCIAL',
}

export interface RoomAttributes {
  title?: string;
  type?: RoomType;
  speakers?: Array<Omit<UserInstance, 'token'>>;
  listenersCount?: number;
}

export interface RoomInstance {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  title: string;
  type: RoomType;
  speakers: Array<Omit<UserInstance, 'token'>>;
  listenersCount: number;
}

@Table({
  modelName: 'Room',
  tableName: 'rooms',
  underscored: false,
})
export default class Room extends Model<RoomInstance, RoomAttributes> {
  @Column({
    type: DataType.STRING,
  })
  title?: string;

  @Column(DataType.ENUM({ values: Object.keys(RoomType) }))
  type?: RoomType;

  @Column({
    type: DataType.JSON,
  })
  speakers?: RoomInstance['speakers'];

  @Column({
    type: DataType.INTEGER,
  })
  listenersCount?: number;
}
