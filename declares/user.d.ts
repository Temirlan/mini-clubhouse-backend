import { UserInstance } from '../db/models/user';
import express from 'express';
import * as core from 'express-serve-static-core';

declare module global {
  namespace Express {
    interface User extends UserInstance {}
  }
}

declare module 'express' {
  interface RequestUser<P = core.ParamsDictionary, ReqBody = any, ResBody = any>
    extends express.Request<P, ResBody, ReqBody> {
    user: UserInstance;
  }
}
