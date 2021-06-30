import { ApiModel, ApiModelProperty } from 'swagger-express-ts';

@ApiModel({
  name: 'User',
})
export class UserDTO {
  @ApiModelProperty({
    description: 'Id of user',
    example: 123456789,
    required: true,
  })
  public id!: number;

  @ApiModelProperty({
    description: 'Fullname of user',
    required: true,
  })
  public fullname!: string;

  @ApiModelProperty({
    description: 'Avatar path of user',
    required: true,
  })
  public avatarUrl!: string;

  @ApiModelProperty({
    description: 'Phone of user',
    required: true,
  })
  public phone!: string;

  @ApiModelProperty({
    description: 'Username of user',
    required: true,
  })
  public username!: string;

  @ApiModelProperty({
    description: 'Username of user',
    required: true,
  })
  public isActive!: number;

  @ApiModelProperty({
    description: 'Created at of user',
    required: true,
  })
  public createdAt!: string;

  @ApiModelProperty({
    description: 'Updated at of user',
    required: true,
  })
  public updatedAt!: string;
  @ApiModelProperty({
    description: 'Token of user',
    required: true,
  })
  public token!: string;
}

@ApiModel({
  name: 'Speaker',
})
export class SpeakerDTO {
  @ApiModelProperty({
    description: 'Id of user',
    example: 123456789,
    required: true,
  })
  public id!: number;

  @ApiModelProperty({
    description: 'Fullname of user',
    required: true,
  })
  public fullname!: string;

  @ApiModelProperty({
    description: 'Avatar path of user',
    required: true,
  })
  public avatarUrl!: string;

  @ApiModelProperty({
    description: 'Phone of user',
    required: true,
  })
  public phone!: string;

  @ApiModelProperty({
    description: 'Username of user',
    required: true,
  })
  public username!: string;
}

@ApiModel({
  name: 'UpdateUserDTO',
})
export class UpdateUserDTO {
  @ApiModelProperty({
    description: 'Fullname of user',
    required: false,
    example: 'fullname',
  })
  public fullname!: string;

  @ApiModelProperty({
    description: 'Phone of user',
    required: false,
    example: 'phone',
  })
  public phone!: string;
}
