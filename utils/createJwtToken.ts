import jwt from 'jsonwebtoken';
import { UserInstance } from './../db/models/user';
import { SECRET_KEY_JWT, MAX_AGE_JWT } from './constants';

export const createJwtToken = (user: Partial<UserInstance>) => {
  const token = jwt.sign(
    {
      data: user,
    },
    SECRET_KEY_JWT as string,
    {
      expiresIn: MAX_AGE_JWT,
      algorithm: 'HS256',
    },
  );

  return token;
};
