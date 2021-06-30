import { injectable, inject } from 'inversify';
import {
  interfaces,
  controller,
  httpGet,
  requestParam,
  response,
  request,
} from 'inversify-express-utils';
import { ApiPath, SwaggerDefinitionConstant, ApiOperationGet } from 'swagger-express-ts';
import * as express from 'express';

import { passport } from '../../core/passport';
import { FRONTEND_URL } from '../../utils/constants';
import User from './../../db/models/user';

@ApiPath({
  name: 'Auth',
  path: '/auth',
  security: { Bearer: [] },
})
@controller('/auth')
export class AuthController implements interfaces.Controller {
  @ApiOperationGet({
    description: 'Get instance user',
    path: '/me',
    responses: {
      200: {
        model: 'User',
      },
      400: {},
    },
  })
  @httpGet('/me', passport.authenticate('jwt', { session: false }))
  public async me(
    @request() req: express.RequestUser,
    @response() res: express.Response,
  ): Promise<void> {
    const user = await User.findByPk(req.user.id);

    res.json(user);
  }

  @ApiOperationGet({
    description: 'Get auth through github',
    path: '/github',
    responses: {
      200: {
        model: 'User',
      },
      400: {},
    },
  })
  @httpGet('/github', passport.authenticate('github'))
  public getAuthGithub(@response() res: express.Response): void {}

  @ApiOperationGet({
    description: 'Get auth github callback',
    path: '/github/callback',
    responses: {
      200: {},
      400: {},
    },
  })
  @httpGet(
    '/github/callback',
    passport.authenticate('github', {
      failureRedirect: '/login',
    }),
  )
  public getAuthGithubCallback(req: express.Request, res: express.Response): void {
    res.send(`<script>
      window.opener.postMessage('${JSON.stringify(req.user)}', '${FRONTEND_URL}');
      window.close();
      </script>`);
  }
}
