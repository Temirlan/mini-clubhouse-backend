import {
  interfaces,
  controller,
  httpGet,
  httpPost,
  httpPatch,
  httpDelete,
} from 'inversify-express-utils';
import {
  ApiOperationPost,
  ApiPath,
  ApiOperationGet,
  ApiOperationPatch,
  SwaggerDefinitionConstant,
  ApiOperationDelete,
} from 'swagger-express-ts';
import * as express from 'express';
import { inject } from 'inversify';

import { passport } from '../../core/passport';
import Room from './../../db/models/room';
import { body, validationResult, check } from 'express-validator';
import { CreateRoomDTO } from './room.model';

@ApiPath({
  name: 'Room',
  path: '/rooms',
  security: { Bearer: [] },
})
@controller('/rooms', passport.authenticate('jwt', { session: false }))
export class RoomController implements interfaces.Controller {
  // constructor(@inject(UserService) private userService: UserService) {}

  @ApiOperationGet({
    description: 'Get rooms',
    path: '',

    responses: {
      200: {
        model: 'Room',
        type: SwaggerDefinitionConstant.Response.Type.ARRAY,
      },
      400: {},
      500: {},
    },
  })
  @httpGet('')
  public async index(req: express.RequestUser, res: express.Response) {
    try {
      const rooms = await Room.findAll();

      res.json(rooms);
    } catch (error) {
      res.status(500).json({
        msg: 'Error',
        error,
      });
    }
  }

  @ApiOperationPost({
    description: 'Create room',
    path: '',
    parameters: {
      body: {
        description: 'Create room',
        model: 'CreateRoomDTO',
      },
    },
    responses: {
      200: {
        model: 'Room',
      },
    },
  })
  @httpPost(
    '',
    body('title').notEmpty().withMessage('Title is missing'),
    body('type').notEmpty().withMessage('Type is missing'),
  )
  public async create(req: express.RequestUser<{}, CreateRoomDTO>, res: express.Response) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const body = req.body;
      const room = await Room.create(body);

      res.json(room);
    } catch (error) {
      res.status(500).json({
        msg: 'Error',
        error,
      });
    }
  }

  @ApiOperationGet({
    description: 'Get room by id',
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
        model: 'Room',
      },
    },
  })
  @httpGet('/:id', check('id').toInt())
  public async show(
    req: express.RequestUser<{
      id: number; // || NAN
    }>,
    res: express.Response,
  ) {
    try {
      const roomId = req.params.id;

      if (isNaN(roomId)) {
        return res.status(400).json({
          msg: 'Invalid id room',
        });
      }

      const room = await Room.findByPk(roomId);

      if (!room) {
        res.status(404).json({
          msg: 'Room is not found.',
        });
      }

      res.json(room);
    } catch (error) {
      res.status(500).json({
        msg: 'Error',
        error,
      });
    }
  }

  @ApiOperationDelete({
    description: 'Delete room by id',
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
      200: {},
    },
  })
  @httpDelete('/:id', check('id').toInt())
  public async delete(
    req: express.RequestUser<{
      id: number; // || NAN
    }>,
    res: express.Response,
  ) {
    try {
      const roomId = req.params.id;

      if (isNaN(roomId)) {
        return res.status(400).json({
          msg: 'Invalid id room',
        });
      }

      await Room.destroy({
        where: {
          id: roomId,
        },
      });

      res.send();
    } catch (error) {
      res.status(500).json({
        msg: 'Error',
        error,
      });
    }
  }
}
