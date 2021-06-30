import { Sequelize } from 'sequelize-typescript';
import { DB_USER, DB_NAME, DB_PASSWORD, DB_HOST, DB_PORT } from '../../utils/constants';
import Code from './code';
import User from './user';
import Room from './room';

const sequelize = new Sequelize({
  dialect: 'postgres',
  database: DB_NAME,
  username: DB_USER,
  password: DB_PASSWORD,
  host: DB_HOST,
  port: Number(DB_PORT),
  models: [User, Code, Room],
});

export { sequelize };
