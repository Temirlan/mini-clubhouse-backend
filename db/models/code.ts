import { Table, Model, Column, DataType } from 'sequelize-typescript';

export interface CodeAttributes {
  code?: string;
  userId?: number;
}

export interface CodeInstance {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  code: string;
  userId: number;
}

@Table({
  modelName: 'Code',
  tableName: 'codes',
  underscored: false,
})
export default class Code extends Model<CodeInstance, CodeAttributes> {
  @Column({
    unique: true,
    type: DataType.STRING,
  })
  code?: string;

  @Column({
    unique: true,
    type: DataType.NUMBER,
  })
  userId?: number;
}
