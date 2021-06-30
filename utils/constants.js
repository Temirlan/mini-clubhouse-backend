import dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config();

let path;

switch (process.env.NODE_ENV) {
  case 'test':
    path = resolve(__dirname, '../.env.test');
    break;
  case 'production':
    path = resolve(__dirname, '../.env.production');
    break;
  default:
    path = resolve(__dirname, '../.env.development');
}

dotenv.config({ path });

const DB_USER = process.env.DB_USER;
const DB_NAME = process.env.DB_NAME;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_HOST = process.env.DB_HOST;
const DB_PORT = process.env.DB_PORT;
const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
const FRONTEND_URL = process.env.FRONTEND_URL;
const API_URL = process.env.API_URL;
const NODE_ENV = process.env.NODE_ENV;
const CLOUDINARY_NAME = process.env.CLOUDINARY_NAME;
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
const CLOUDINARY_SECRET_KEY = process.env.CLOUDINARY_SECRET_KEY;
const SECRET_KEY_JWT = process.env.SECRET_KEY_JWT;
const MAX_AGE_JWT = process.env.MAX_AGE_JWT;

export {
  DB_USER,
  DB_NAME,
  DB_PASSWORD,
  DB_HOST,
  DB_PORT,
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
  FRONTEND_URL,
  API_URL,
  NODE_ENV,
  CLOUDINARY_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_SECRET_KEY,
  SECRET_KEY_JWT,
  MAX_AGE_JWT,
};
