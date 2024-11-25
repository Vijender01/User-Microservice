import { Injectable } from '@nestjs/common';
import { IUser } from './interfaces/user.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';


@Injectable()
export class AppService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<IUser>,
  ){}
  getHello(): string {
    return 'Hello World!';
  }

  public async searchUser(params: { email: string }): Promise<IUser[]> {
    return this.userModel.find(params).exec();
  }
}
