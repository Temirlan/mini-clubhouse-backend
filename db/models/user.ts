import { Table, Model, Column, DataType } from 'sequelize-typescript';

export interface UserAttributes {
  fullname?: string;
  avatarUrl?: string;
  phone?: string;
  username?: string;
  isActive?: number;
}

export interface UserInstance {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  fullname: string;
  avatarUrl: string;
  phone: string;
  username: string;
  isActive: number;
  token?: string;
}

@Table({
  modelName: 'User',
  tableName: 'users',
  underscored: false,
})
export default class User extends Model<UserInstance, UserAttributes> {
  @Column(DataType.STRING)
  fullname?: string;

  @Column(DataType.STRING)
  avatarUrl?: string;

  @Column(DataType.STRING)
  phone?: string;

  @Column(DataType.STRING)
  username?: string;

  @Column(DataType.NUMBER)
  isActive?: number;
}
