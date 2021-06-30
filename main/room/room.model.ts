import { ApiModel, ApiModelProperty } from 'swagger-express-ts';
import { RoomType } from '../../db/models/room';
import { SpeakerDTO } from './../user/user.model';

@ApiModel({
  name: 'Room',
})
export class RoomDTO {
  @ApiModelProperty({
    description: 'Id of room',
    example: 123456789,
    required: true,
  })
  public id!: number;

  @ApiModelProperty({
    description: 'Title of room',
    required: true,
  })
  public title!: string;

  @ApiModelProperty({
    description: 'Type of room',
    required: true,
    example: 'open',
    enum: [...new Set(Object.values(RoomType))],
  })
  public type!: string;

  @ApiModelProperty({
    description: 'Speakers of room',
    required: true,
    model: 'Speaker',
  })
  public speakers!: SpeakerDTO[];

  @ApiModelProperty({
    description: 'Listeners count of room',
    required: true,
  })
  public listenersCount!: number;

  @ApiModelProperty({
    description: 'Created at of room',
    required: true,
  })
  public createdAt!: string;

  @ApiModelProperty({
    description: 'Updated at of room',
    required: true,
  })
  public updatedAt!: string;
}

@ApiModel({
  name: 'CreateRoomDTO',
})
export class CreateRoomDTO {
  @ApiModelProperty({
    description: 'Title of room',
    required: true,
    example: 'test room',
  })
  public title!: string;

  @ApiModelProperty({
    description: 'Type of room',
    required: true,
    example: 'open',
    enum: [...new Set(Object.values(RoomType))],
  })
  public type!: RoomType;
}
