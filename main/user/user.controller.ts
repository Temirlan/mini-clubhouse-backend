import { interfaces, controller, httpGet, httpPost, httpPatch } from 'inversify-express-utils';
import { validationResult, check } from 'express-validator';
import {
  ApiOperationPost,
  ApiPath,
  ApiOperationGet,
  ApiOperationPatch,
  SwaggerDefinitionConstant,
} from 'swagger-express-ts';
import * as express from 'express';
import { inject } from 'inversify';

import avatarMulterCloudinary from '../../core/avatar-multer-cloudinary';

import { passport } from '../../core/passport';
import { UserService } from './user.service';
import { UpdateUserDTO } from './user.model';
import User from './../../db/models/user';

@ApiPath({
  name: 'User',
  path: '/user',
  security: { Bearer: [] },
})
@controller('/user')
export class UserController implements interfaces.Controller {
  constructor(@inject(UserService) private userService: UserService) {}

  @ApiOperationPost({
    description: 'Upload avatar',
    path: '/upload/avatar',
    parameters: {
      formData: {
        avatar: {
          required: true,
        },
      },
    },
    responses: {
      200: {},
      400: {},
    },
  })
  @httpPost(
    '/upload/avatar',
    passport.authenticate('jwt', { session: false }),
    avatarMulterCloudinary.single('avatar'),
  )
  public async uploadAvatar(req: express.RequestUser, res: express.Response) {
    const userId = req.user.id;
    const url = await this.userService.saveAvatar(req.file.path, userId);

    res.json(url);
  }

  @ApiOperationGet({
    description: 'Send code to phone',
    path: '/sms',
    parameters: {
      query: {
        phone: {
          required: true,
          type: 'string',
        },
      },
    },

    responses: {
      200: {},
      400: {},
      500: {},
    },
  })
  @httpGet(
    '/sms',
    passport.authenticate('jwt', { session: false }),
    check('phone')
      .isMobilePhone('kk-KZ', {
        strictMode: false,
      })
      .withMessage('Invalid phone'),
  )
  public async sendCodeToPhone(req: express.RequestUser, res: express.Response) {
    const phone = req.query.phone;
    const userId = req.user.id;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      await this.userService.sendSMS(phone as string, userId);

      res.status(201).json();
    } catch (error) {
      if (error.message === 'Validation error') {
        return res.status(400).json({
          msg: 'Code has already been sent!',
        });
      }
      res.status(500).json({
        msg: 'Error when sending SMS',
      });
    }
  }

  @ApiOperationGet({
    description: 'Send code to phone',
    path: '/sms/activate',
    parameters: {
      query: {
        code: {
          required: true,
          type: 'string',
        },
      },
    },

    responses: {
      200: {},
      400: {},
      500: {},
    },
  })
  @httpGet('/sms/activate', passport.authenticate('jwt', { session: false }))
  public async codeActivate(req: express.RequestUser, res: express.Response) {
    const code = req.query.code;
    const userId = req.user.id;

    if (!code) {
      res.status(400).json({
        msg: 'Error code is missing',
      });
    }

    try {
      await this.userService.activateCode(code as string, userId);

      return res.send();
    } catch (error) {
      res.status(500).json({
        msg: 'Error when activating code',
      });
    }
  }

  @ApiOperationGet({
    description: 'Get user by id',
    path: '/{id}',
    parameters: {
      path: {
        id: {
          type: SwaggerDefinitionConstant.Response.Type.NUMBER,
          required: true,
        },
      },
    },
    responses: {
      200: {
        model: 'User',
      },
    },
  })
  @httpGet('/:id', passport.authenticate('jwt', { session: false }), check('id').toInt())
  public async show(
    req: express.RequestUser<{
      id: number; // || NAN
    }>,
    res: express.Response,
  ) {
    try {
      const userId = req.params.id;

      if (isNaN(userId)) {
        return res.status(400).json({
          msg: 'Invalid id user',
        });
      }

      const user = await User.findByPk(userId);

      if (!user) {
        res.status(404).json({
          msg: 'User is not found.',
        });
      }

      res.json(user);
    } catch (error) {
      res.status(500).json({
        msg: 'Error',
        error,
      });
    }
  }

  @ApiOperationPatch({
    description: 'Update user',
    path: '',
    parameters: {
      body: {
        description: 'Update user',
        model: 'UpdateUserDTO',
      },
    },
    responses: {
      200: {
        model: 'User',
      },
      400: {},
    },
  })
  @httpPatch(
    '/',
    passport.authenticate('jwt', { session: false }),
    check('phone')
      .optional({ checkFalsy: true })
      .isMobilePhone('kk-KZ', {
        strictMode: false,
      })
      .withMessage('Invalid phone'),
  )
  public async updateUser(req: express.RequestUser<{}, UpdateUserDTO>, res: express.Response) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const body = req.body;
    const userId = req.user.id;
    const user = await this.userService.updateUser(body, userId);

    res.json(user);
  }
}
