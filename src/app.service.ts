import { Injectable } from '@nestjs/common';
import { IUser } from './interfaces/user.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IUserLink } from './interfaces/user-link.schema';


@Injectable()
export class AppService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<IUser>,
    @InjectModel('UserLink') private readonly userLinkModel: Model<IUserLink>,
  ){}
  getHello(): string {
    return 'Hello World!';
  }

  public async searchUser(params: { email: string }): Promise<IUser[]> {
    return this.userModel.find(params).exec();
  }

  public async createUser(user: IUser): Promise<IUser> {
    const userModel = new this.userModel(user);
    return await userModel.save();
  }

  public async createUserLink(id: string): Promise<IUserLink> {
    const userLinkModel = new this.userLinkModel({
      user_id: id,
    });
    return await userLinkModel.save();
  }
}
