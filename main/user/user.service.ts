import { injectable, inject } from 'inversify';
import 'reflect-metadata';

import { cloudinary } from '../../core/cloudinary';
import Code from '../../db/models/code';
import User from '../../db/models/user';
import { UpdateUserDTO } from './user.model';
import { randomCode } from './user.utils';

@injectable()
export class UserService {
  public async sendSMS(phone: string, userId: number) {
    const smsCode = String(randomCode());
    //TODO: add sending sms on phone through service sms.ru
    // await Axios.get(
    //   `https://sms.ru/sms/send?api_id=${process.env.SMS_API_KEY}&to=${phone}&msg=${smsCode}`,
    // );

    await Code.create({
      code: smsCode,
      userId,
    });

    await User.update(
      {
        phone,
      },
      { where: { id: userId } },
    );
  }

  public async updateUser(dto: UpdateUserDTO, userId: number) {
    try {
      await User.update(
        {
          ...dto,
        },
        { where: { id: userId } },
      );

      return this.findUserById(userId);
    } catch (error) {
      throw new Error(error);
    }
  }

  public async saveAvatar(path: string, userId: number) {
    const data = await cloudinary.uploader.upload(path);
    const avatarUrl = data.url;

    await User.update(
      {
        avatarUrl,
      },
      { where: { id: userId } },
    );

    return avatarUrl;
  }

  public async activateCode(code: string, userId: number) {
    const whereQuery = {
      where: {
        code,
        userId,
      },
    };

    const findCode = await Code.findOne(whereQuery);

    if (findCode) {
      await Code.destroy(whereQuery);
      await User.update(
        {
          isActive: 1,
        },
        { where: { id: userId } },
      );
    } else {
      throw new Error('Code not found');
    }
  }

  private async findUserById(id: number) {
    try {
      return User.findByPk(id);
    } catch (error) {
      throw new Error('User not found!');
    }
  }

  private async findCodeByUserId(userId: number) {
    try {
      return Code.findOne({
        where: {
          userId,
        },
      });
    } catch (error) {
      throw new Error('Code not found');
    }
  }
}
